# Content

Source of truth for the portfolio site **and** the chatbot. Edit these files to change career facts; the web app and API both read them through `@portfolio/content-core`.

| Path | Used for |
|------|----------|
| `about.md` | About page |
| `skills.json` | Skills page + skill→project links for chat |
| `certifications.json` | Certifications on About |
| `projects/*.md` | Project list + detail pages |
| `experience/*.md` | Experience page |
| `writing/*.md` | Writing list + articles |

After edits, refresh the Next.js site. For chat to pick up changes, restart the API or call `POST /api/reindex` (see [docs/guide/HOW_IT_WORKS.md](../docs/guide/HOW_IT_WORKS.md)).
