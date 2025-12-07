/**
 * Creates or updates a PR for GAME_DESIGN.md changes (release-please style)
 *
 * This script maintains a single "design update" PR that gets continuously updated
 * when design documents change. When the PR is merged, a new cycle begins.
 *
 * @param {Object} options - GitHub Actions context
 * @param {Object} options.github - Authenticated Octokit instance
 * @param {Object} options.context - GitHub Actions context
 * @param {Object} options.core - GitHub Actions core utilities
 * @param {Object} options.exec - GitHub Actions exec utilities
 */
module.exports = async ({ github, context, core, exec }) => {
  const ALLOWED_FILE = "docs/GAME_DESIGN.md";
  const BRANCH_NAME = "design/game-design-update";
  const PR_TITLE = "docs: update GAME_DESIGN.md";
  const COMMIT_MESSAGE = "docs: update GAME_DESIGN.md based on design changes";

  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const baseBranch = context.ref.replace("refs/heads/", "");

  // Check for changes in GAME_DESIGN.md
  let statusOutput = "";
  await exec.exec("git", ["status", "--porcelain", ALLOWED_FILE], {
    listeners: {
      stdout: (data) => {
        statusOutput += data.toString();
      },
    },
  });

  const changes = statusOutput
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.trim().split(/\s+/)[1]);

  if (changes.length === 0) {
    core.info("No changes detected in GAME_DESIGN.md");
    return;
  }

  core.info(`Detected changes in: ${changes.join(", ")}`);

  // Verify only GAME_DESIGN.md is changed
  if (changes.length !== 1 || changes[0] !== ALLOWED_FILE) {
    core.warning(`Unexpected files changed: ${changes.join(", ")}`);
    core.warning(`Only ${ALLOWED_FILE} is allowed to be committed`);
    return;
  }

  // Check if PR branch already exists
  let branchExists = false;
  try {
    await github.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${BRANCH_NAME}`,
    });
    branchExists = true;
    core.info(`Branch ${BRANCH_NAME} already exists`);
  } catch (error) {
    if (error.status === 404) {
      core.info(`Branch ${BRANCH_NAME} does not exist, will create it`);
    } else {
      throw error;
    }
  }

  // Get base branch commit SHA
  const { data: baseRefData } = await github.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });
  const baseCommitSha = baseRefData.object.sha;
  core.info(`Base commit (${baseBranch}): ${baseCommitSha}`);

  // Read file content
  let fileContent = "";
  await exec.exec("cat", [ALLOWED_FILE], {
    listeners: {
      stdout: (data) => {
        fileContent += data.toString();
      },
    },
  });

  // Create blob for the file
  const { data: blobData } = await github.rest.git.createBlob({
    owner,
    repo,
    content: Buffer.from(fileContent).toString("base64"),
    encoding: "base64",
  });

  core.info(`Created blob: ${blobData.sha}`);

  // Get base tree
  const { data: baseCommitData } = await github.rest.git.getCommit({
    owner,
    repo,
    commit_sha: baseCommitSha,
  });

  // Create new tree with updated file
  const { data: treeData } = await github.rest.git.createTree({
    owner,
    repo,
    base_tree: baseCommitData.tree.sha,
    tree: [
      {
        path: ALLOWED_FILE,
        mode: "100644",
        type: "blob",
        sha: blobData.sha,
      },
    ],
  });

  core.info(`Created tree: ${treeData.sha}`);

  // Create commit
  const { data: newCommitData } = await github.rest.git.createCommit({
    owner,
    repo,
    message: COMMIT_MESSAGE,
    tree: treeData.sha,
    parents: [baseCommitSha],
  });

  core.info(`Created commit: ${newCommitData.sha}`);

  // Create or update branch
  if (branchExists) {
    // Update existing branch
    await github.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${BRANCH_NAME}`,
      sha: newCommitData.sha,
      force: true, // Force update to avoid conflicts
    });
    core.info(`✓ Updated branch ${BRANCH_NAME}`);
  } else {
    // Create new branch
    await github.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${BRANCH_NAME}`,
      sha: newCommitData.sha,
    });
    core.info(`✓ Created branch ${BRANCH_NAME}`);
  }

  // Check if PR already exists
  const { data: existingPRs } = await github.rest.pulls.list({
    owner,
    repo,
    head: `${owner}:${BRANCH_NAME}`,
    base: baseBranch,
    state: "open",
  });

  if (existingPRs.length > 0) {
    const pr = existingPRs[0];
    core.info(`PR #${pr.number} already exists, updated with latest changes`);
    core.setOutput("pr-number", pr.number);
    core.setOutput("pr-url", pr.html_url);
    core.setOutput("pr-action", "updated");
  } else {
    // Create new PR
    const { data: newPR } = await github.rest.pulls.create({
      owner,
      repo,
      title: PR_TITLE,
      head: BRANCH_NAME,
      base: baseBranch,
      body: `## Summary

This PR updates \`GAME_DESIGN.md\` based on design document changes.

### Changes
- Updated game design documentation

---
🤖 This PR is automatically managed. It will be updated when design documents change.
`,
    });

    core.info(`✓ Created PR #${newPR.number}`);
    core.setOutput("pr-number", newPR.number);
    core.setOutput("pr-url", newPR.html_url);
    core.setOutput("pr-action", "created");
  }
};
