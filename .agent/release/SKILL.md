---
name: release
description: Orchestrate the complete Heng Blog release workflow. Use when the user asks to release or publish the current work end to end. Invoke the project-local pre-publish, publish, and post-publish skills in that exact order, stop when any stage fails, and return one consolidated release result. Use an individual stage skill instead when the user requests only a check, deployment, or verification stage.
---

# Release

Run exactly this state machine:

1. Read and execute `../pre-publish/SKILL.md`.
2. Continue only when `pre-publish` reports success.
3. Read and execute `../publish/SKILL.md`.
4. Continue only when `publish` returns both a pushed commit SHA and a Cloudflare deployment URL.
5. Read and execute `../post-publish/SKILL.md` using that SHA and every affected route.
6. Finish only when `post-publish` reports the GitHub and Cloudflare results separately.

Never skip, reorder, or run stages concurrently. On failure, stop immediately and report:

- failed stage;
- failed command or condition;
- required corrective action;
- stages not run.

On success, return the commit SHA, deployment URL, GitHub Actions result, verified canonical routes,
and final worktree state.
