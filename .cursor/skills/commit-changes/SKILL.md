---
name: commit-changes
description: Group and commit local changes into one or more conventional commits
disable-model-invocation: true
---

# Commit changes (grouped)

When invoked, do the following in order.

## 1. Read conventions

- **[commit-message.mdc](rule:commit-message.mdc)** — every commit message must match.

## 2. Inspect the working tree

- Run `git status` and `git diff --stat` (and `git diff` if needed).
- Group changes by purpose (e.g. types vs UI vs config). Each group becomes one commit where possible.

## 3. Plan commits

- Prefer **multiple commits** when purposes differ; order foundational changes first (e.g. API/types before UI).
- Do **not** create a new branch unless the user asked for one.

## 4. Create commits

For each group:

1. Stage only relevant paths (`git add <paths>` or `git add -p`).
2. Commit with `git commit -m "..."` using `<type>(<scope>): <subject>` from the rule.

## 5. Summarize

- List commits created (type, scope, subject).
- Confirm working tree is clean or explain what was left unstaged.
