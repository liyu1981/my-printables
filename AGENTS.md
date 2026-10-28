# Agent Rules

## Git commits

- **Never commit on your own initiative.** Do not run `git commit`, `git commit --amend`, or any other
  operation that creates, rewrites, or moves a commit unless the user explicitly asks you to commit.
- **When the user asks you to commit, create exactly one commit** for that request, with a clear message
  describing the work.
- **Then return to the waiting state.** Report the commit hash and message, and wait for the next explicit
  commit request. Do not make additional commits (including follow-up fixes or "while I'm here" changes)
  unless the user asks again.
- If tests/checks fail before committing, report the failure and ask how to proceed instead of committing.
- Do not push, tag, rebase, merge, or force-push unless the user explicitly asks for it in a separate
  instruction.
