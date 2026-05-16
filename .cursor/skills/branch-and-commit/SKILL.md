---
name: branch-and-commit
description: "Git Flow: create branch from develop (or main for hotfix) and commit changes once"
disable-model-invocation: true
---

# Git Flow branch and commit

When invoked, do the following in order.

## 1. Read conventions

- **[branch-naming.mdc](rule:branch-naming.mdc)** — new branch name and base branch (`develop` vs `main`).
- **[commit-message.mdc](rule:commit-message.mdc)** — commit message.

## 2. Inspect changes

- `git status` and `git diff --stat` to understand scope and pick branch prefix/slug.

## 3. Branch (Git Flow)

Pick the **base branch** before `git checkout -b`:

| Prefix (`<prefix>/<slug>`)                         | Base branch |
| -------------------------------------------------- | ----------- |
| `hotfix/*`                                         | **`main`**  |
| `feature/*`, `fix/*`, `chore/*`, `docs/*`, `refactor/*`, `test/*`, `release/*` | **`develop`** |

- If the repo has a remote: `git fetch origin <base>`.
- `git checkout <base>` then update (e.g. `git pull --ff-only origin <base>` or your team's equivalent) so the new branch starts from latest integration/production as appropriate.
- If you are currently on **`main`** and the chosen base is **`develop`** (normal case), **checkout and update `develop` first**, then create the branch. Do **not** create feature/fix/release branches directly off `main` unless policy says otherwise.

Then: `git checkout -b <prefix>/<slug>` per the branch rule.

## 4. Single commit

- Stage all intended files (`git add -A` or selective add).
- One commit: `<type>(<scope>): <subject>` per commit-message rule.

## 5. Summarize

- Report branch name, base branch used, and commit message.
