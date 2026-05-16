---
name: branch-and-commit
description: "Git Flow: branch from develop or main when on trunk, else commit once on current branch"
disable-model-invocation: true
---

# Git Flow branch and commit

When invoked, do the following in order.

## 1. Read conventions

- **[branch-naming.mdc](rule:branch-naming.mdc)** — branch name (`<prefix>/<slug>`) when **creating** a branch, and conventions.
- **[commit-message.mdc](rule:commit-message.mdc)** — commit message (`<type>(<scope>): <subject>`).

## 2. Inspect changes

- `git branch --show-current` → **current branch** (if empty / detached HEAD, stop and ask the user to checkout a named branch).
- `git status` and `git diff --stat` to understand scope and pick branch prefix/slug plus commit wording.

## 3. Branch (Git Flow): path A vs path B

Treat these as **trunk/integration** branches → **path A**: `main`, `develop`, `master`.

**Path B — not on trunk** (`feature/*`, `fix/*`, or any other named branch):

- **Do not** `git checkout` to another branch and **do not** `git checkout -b`.
- Go to **[§ 4 Single commit](#4-single-commit)** on the **current branch**.

**Path A — on trunk**:

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

- **Path A**: report new branch name, **base branch** used (`develop` / `main`), and commit message.
- **Path B**: report commit message and that changes were committed on **`<current-branch>`** (**no new branch**).
