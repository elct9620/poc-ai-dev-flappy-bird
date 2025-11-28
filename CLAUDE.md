# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A proof-of-concept to verify Claude Code as GitHub App can run inside GitHub Actions and use issue-based instructions to build a Flappy Bird game.

**Tech Stack:**
- TypeScript with strict mode
- Vite (using rolldown-vite fork)
- Vanilla TypeScript (no framework)
- pnpm as package manager

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Important Notes

- This project uses `rolldown-vite@7.2.5` as a Vite replacement (specified in pnpm overrides)
- TypeScript uses strict mode with bundler module resolution
- Entry point: `index.html` → `src/main.ts`
