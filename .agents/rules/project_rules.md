# Project Constraints & Rules

These rules MUST be followed at all times for this project:

## Architecture & Hosting Constraint

- **Cloudflare Pages:** The application is deployed to Cloudflare Pages for free. Any plans, architecture decisions, and technology choices MUST be compatible with this constraint.
- **Reference:** Always consult the Cloudflare Pages documentation (https://developers.cloudflare.com/pages/) when making architectural decisions (e.g., choosing a framework adapter, handling server-side logic).
- **Cost:** This site must be hosted for free, so absolutely nothing is to be implemented that would cost money (e.g. no paid third-party APIs, no paid database hosting without free tiers, etc).

## Text Formatting (User Facing)

- **Sentence Case:** Everything in user-facing text, page content, badges, buttons, headers, etc. MUST be strictly sentence case. No title case, no all uppercase, no all lowercase.

## Punctuation (User Facing)

- **No Exclamation Points:** Never use exclamation points.
- **Questions:** Always use question marks for questions.
- **Periods:** Only use periods between sentences in the same line or paragraph.
  - If there is only one sentence, do NOT use a period.
  - If there are multiple sentences, the first sentences get a period, but the final sentence does NOT get a period.

## Code Formatting

- **Indentation:** All code is to be 2-space indented.
- **Comments:** Do NOT write code comments.
- **Whitespace:** No trailing whitespace on any lines.
- **File Endings:** There must NEVER be empty lines (newlines) at the end of any file.
