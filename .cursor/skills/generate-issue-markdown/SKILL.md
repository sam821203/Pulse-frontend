---
name: generate-issue-markdown
description: Generate English issue markdown from branch context
disable-model-invocation: true
---

# Generate issue markdown

When invoked, output **one** issue in Markdown inside a **single ```markdown** fenced block for one-click copy.

## 1. Context

- Branch: `git branch --show-current`.
- Base: **`develop`** by default (Git Flow); use **`main`** for **`hotfix/*`** or if the user specifies otherwise.
- Commits: `git log <base>..HEAD --oneline` (+ optional stat).
- Infer title, description, repro or proposed solution, and acceptance criteria.

## 2. Structure

Include: **Title**, **Description**, **Steps to reproduce** or **Proposed solution**, **Acceptance criteria**, optional **Additional context** (e.g. `Branch: <name>`).

## 3. Output

- Start the assistant reply with the fenced block (minimal preamble).
- Clear, concise English.
