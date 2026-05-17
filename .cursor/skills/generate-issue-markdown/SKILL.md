---
name: generate-issue-markdown
description: Generate English issue markdown from branch context
disable-model-invocation: true
---

# Generate issue markdown

When invoked, output **one** GitHub-style issue in Markdown inside a **single ```markdown** fenced block for one-click copy.

Issues describe **the problem or need** — not what was implemented. Do **not** mirror [`.github/pull_request_template.md`](.github/pull_request_template.md) (no test plan, checklist, changes list, or branch name).

## 1. Context

- Branch: `git branch --show-current`.
- Base: **`develop`** by default (Git Flow); use **`main`** for **`hotfix/*`** or if the user specifies otherwise.
- Commits: `git log <base>..HEAD --oneline` (+ optional `--stat`).
- From branch name, commit messages, and changed paths, infer **issue type** (`bug` | `feature` | `chore`) and the **problem or motivation** the work addresses. Use commits only to understand scope — write as if filing the issue **before** the work, not as a post-merge summary.

## 2. Structure by type

Use a prefix in the title: `[Bug]`, `[Feature]`, or `[Chore]`.

**Writing style:** Under each `##` section, use **bullet lists** (`-`), not paragraphs. Prefer 2–5 short bullets per section; one idea per bullet. Omit empty sections.

### Bug

- **Description** — what is wrong and user impact (bullets).
- **Steps to reproduce** — bullet list in order.
- **Expected behavior** — what should happen (bullets).
- **Actual behavior** — what happens instead (bullets).

Do **not** add Acceptance criteria, Test plan, or Additional context unless the user asked for environment details (browser, OS, URL) that are essential to reproduce.

### Feature

- **Description** — problem or user need (bullets).
- **Motivation** (optional) — why this matters (bullets).
- **Proposed solution** (optional) — high-level approach only if clear from context (bullets); avoid implementation detail copied from commits.

Do **not** add Acceptance criteria, Steps to reproduce, or branch/PR metadata.

### Chore / refactor / docs / deps

- **Description** — what should improve and why (bullets).

No other sections unless the user explicitly requests them.

## 3. Do not include (PR / retroactive noise)

- **Acceptance criteria** — belongs in planning or PR verification, not in issues generated from branch history.
- **Additional context** with `Branch: …` — branch lives on the PR; link issues via `Fixes #` in the PR, not in the issue body.
- **Summary of changes**, **Test plan**, **Checklist**, or file-level diffs — those belong in the PR description.

## 4. Output

- Start the assistant reply with the fenced block (minimal preamble).
- Clear, concise English.
- One `##` heading per section; body content is always bullet lists under each heading.

Example (bug):

```markdown
## [Bug] Stock detail header shows stale price after refresh

## Description
- After a hard refresh on the company detail page, the header still shows the previous session's last price.
- Users cannot trust the displayed price until they navigate away.

## Steps to reproduce
- Open a listed company detail page and note the price in the header.
- Hard refresh the browser (Cmd+Shift+R).
- Observe the header price.

## Expected behavior
- The header shows the current price or a loading state immediately after refresh.

## Actual behavior
- The header shows a stale price from the prior visit.
```
