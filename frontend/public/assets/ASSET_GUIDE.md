# Asset guide (frontend/public/assets)

Use this structure to keep static files organized:

- `icons/social/`
  - `github.svg`
  - `github-dark.svg`
  - `linkedin.svg`
- `icons/actions/`
  - `demo.svg`
  - `demo-dark.svg`
  - `code.svg`
  - `code-dark.svg`
- `icons/tech/`
  - `react.svg`
  - `react-dark.svg`
  - `typescript.svg`
  - `typescript-dark.svg`
  - `nodejs.svg`
  - `nodejs-dark.svg`
  - `express.svg`
  - `express-dark.svg`
  - `tailwindcss.svg`
  - `tailwindcss-dark.svg`
  - `javascript.svg`
  - `java.svg`
  - `java-dark.svg`
  - `mysql.svg`
  - `mysql-dark.svg`
  - `websockets.svg`
  - `websockets-dark.svg`
  - `docker.svg`
  - `docker-dark.svg`
  - `git.svg`
  - `git-dark.svg`
- `images/profile/`
  - `profile-photo.webp`

## Recommended formats

- Logos/icons: `SVG` (preferred), monochrome or flat-color versions.
- Profile photo: `WebP` for best quality/size ratio.

## Recommended dimensions

- Tech icons: `64x64` px source (rendered at `16x16` or `18x18` in UI).
- Social icons: `24x24` px source (rendered at `18x18` in UI).
- Profile photo: `800x800` px (square crop).

## Naming conventions

- Lowercase, kebab-case.
- Keep filenames stable because data files reference these paths directly.
