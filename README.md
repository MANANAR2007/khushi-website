# khüshi Website (React + Vite)

This project is a React + Vite rebuild with a bold, premium layout while keeping the same content and product container data.

## Project Structure

```
public/
  assets/containers/...
src/
  App.jsx
  data.js
  main.jsx
  styles.css
```

## Run Locally

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## GitHub Pages Deployment

This repo deploys automatically to GitHub Pages on every push to `main` using GitHub Actions.

Steps (one-time):
1. In GitHub, go to Settings → Pages.
2. Under "Build and deployment", select **GitHub Actions**.

The site will be available at:

```
https://mananar2007.github.io/khushi-website/
```

## Updating Product Images

Replace images inside:

```
public/assets/containers/
```

Keep filenames the same (e.g. `500ml_white.jpg`, `750ml_black.jpg`). The app reads these paths from `src/data.js`.

## Notes

- The site uses a scrollable product rail with selectable colors.
- Clicking a product image opens a lightbox view.
