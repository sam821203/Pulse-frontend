---
name: generate-pr-markdown
description: Generate PR markdown from current branch commits
disable-model-invocation: true
---

# Generate PR markdown

When invoked, produce **one copy-friendly PR body** based on the **current branch** and commits against the correct **merge base** (Git Flow).

## 1. Gather git context

- Current branch: `git branch --show-current`.
- Base: **`develop`** by default (feature/fix/release/chore/etc. PRs). For **`hotfix/*`** branches targeting production, use **`main`** instead.
- Commits: `git log <base>..HEAD --oneline` (and `--stat` or diff stat if helpful).
- Infer problem, approach, and bullet list of changes from branch name + commits + files touched.

## 2. Match the template

Use exactly the sections from [.github/pull_request_template.md](mdc:.github/pull_request_template.md).

## 3. Pre-fill

- **Summary**: short bullets for problem + approach.
- **Changes**: concrete bullets (derive from commits/files).
- **Scope**: check **one** scope that matches [commit-message.mdc](rule:commit-message.mdc) scopes.
- Leave checklist, test plan, screenshots, related links for the author unless obvious.

## 4. Output format

- Wrap the full PR body in a ```markdown fenced block so the UI shows a single copy action.
- Professional English; optional line `Branch: <name>` at the end.
