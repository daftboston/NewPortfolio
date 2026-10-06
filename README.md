# Daniel Santoyo: developer portfolio

Bilingual (ES/EN) personal site for **Daniel Santoyo**, a full-stack developer (React, Next.js, React Native) and architect with ~7 years in BIM & Revit, based in Bogotá, Colombia.

**Live:** https://portfoliodanielsantoyo.netlify.app/
**Architecture portfolio:** https://danielsantoyoarq.netlify.app/

## Stack

- Static HTML + CSS + vanilla JavaScript (ES modules). No framework, no build step.
- `<canvas>` star field / black-hole animation (`sky.js`) and a short first-visit intro (`intro.js`).
- Responsive images: WebP `srcset` (640 / 1200 / 1760 px) with optimized JPG fallbacks, lazy-loaded below the fold.
- Hosted on **Netlify**. The contact form uses **Netlify Forms** (`method="POST"`, `data-netlify`, honeypot).

## Features

- ES/EN toggle (CSS `.esp` / `.eng` + `language.js`). The choice is saved in `localStorage` and can be set with `?lang=en|es`.
- Dark/light theme (`darkmode.js`). Saved in `localStorage` and can be set with `?theme=dark|light`.
- The intro plays once per browser (about 2.5 s). It can be skipped with the button, any key, a click or a scroll, and it never plays with `prefers-reduced-motion`. Replay it with `?intro=again`.
- Language-matched CV download (EN résumé / ES hoja de vida).
- Open Graph / Twitter card meta with `assets/images/og-image.jpg` (1200×630).

## Structure

```
index.html                            # all content (ES + EN)
main.js                               # boot: menu, section spy, reveal-on-scroll
intro.js                              # first-visit intro
sky.js                                # canvas sky / black hole
darkmode.js                           # theme toggle
language.js                           # ES/EN toggle, title + alt text
assets/style/style.css                # all styles
assets/images/                        # project screenshots (WebP + JPG), portrait, OG image
Daniel_Santoyo_FullStack_Resume_EN.pdf
Daniel_Santoyo_FullStack_CV_ES.pdf
```

## Run locally

```bash
python3 -m http.server 8000   # or: npx serve .
# open http://localhost:8000
```

Netlify Forms only work on the deployed site. Locally the form posts to the static server and fails, which is expected.
