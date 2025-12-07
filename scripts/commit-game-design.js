/**
 * Commits GAME_DESIGN.md changes directly to the main branch via GitHub API
 *
 * This script is used by GitHub Actions to avoid nested PR loops when
 * design documents are updated. It only commits docs/GAME_DESIGN.md.
 *
 * @param {Object} options - GitHub Actions context
 * @param {Object} options.github - Authenticated Octokit instance
 * @param {Object} options.context - GitHub Actions context
 * @param {Object} options.core - GitHub Actions core utilities
 * @param {Object} options.exec - GitHub Actions exec utilities
 */
module.exports = async ({ github, context, core, exec }) => {
  const ALLOWED_FILE = "docs/GAME_DESIGN.md";
  const COMMIT_MESSAGE = "docs: update GAME_DESIGN.md based on design changes";

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

  // Get current commit SHA
  const { data: refData } = await github.rest.git.getRef({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: `heads/${context.ref.replace("refs/heads/", "")}`,
  });

  const currentCommitSha = refData.object.sha;
  core.info(`Current commit: ${currentCommitSha}`);

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
    owner: context.repo.owner,
    repo: context.repo.repo,
    content: Buffer.from(fileContent).toString("base64"),
    encoding: "base64",
  });

  core.info(`Created blob: ${blobData.sha}`);

  // Get current tree
  const { data: commitData } = await github.rest.git.getCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha: currentCommitSha,
  });

  // Create new tree with updated file
  const { data: treeData } = await github.rest.git.createTree({
    owner: context.repo.owner,
    repo: context.repo.repo,
    base_tree: commitData.tree.sha,
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
    owner: context.repo.owner,
    repo: context.repo.repo,
    message: COMMIT_MESSAGE,
    tree: treeData.sha,
    parents: [currentCommitSha],
  });

  core.info(`Created commit: ${newCommitData.sha}`);

  // Update branch reference
  await github.rest.git.updateRef({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: `heads/${context.ref.replace("refs/heads/", "")}`,
    sha: newCommitData.sha,
  });

  core.info(`✓ Successfully committed ${ALLOWED_FILE} to ${context.ref}`);
  core.setOutput("commit-sha", newCommitData.sha);
  core.setOutput("files-changed", 1);
};
