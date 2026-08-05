# Chat contact fallback

## Problem

When portfolio content does not cover a specific detail (e.g. Intercom authentication), weakly related chunks still retrieve. The model invents a plausible but wrong answer from adjacent facts (app auth, biometrics, etc.).

## Decision

Option C — dual fallback:

1. **Weak retrieval** (no chunks above relevance threshold): return a fixed contact reply; do not call the chat model.
2. **Chunks present but insufficient for the question**: run a strict YES/NO coverage gate against the retrieved context. On NO (or unclear), return the contact reply with empty sources — do not generate an answer. On YES, answer with the normal grounded prompt.

Grounded answers (context explicitly supports the claim) stay unchanged.

## Contact reply

Fixed copy pointing to:

- Email: saurabhsri98@gmail.com
- LinkedIn: https://linkedin.com/in/saurabhafk
- Phone: +91 8574131772
- Optional browse links: /projects, /skills, /about

## Out of scope

Authoring missing project details into content (filled later by Saurabh).
