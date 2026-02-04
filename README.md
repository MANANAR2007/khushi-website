# khüshi Website (React + Vite)

This project is now a React + Vite rebuild with a bold, premium layout while keeping the same content and product container data.

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

## Updating Product Images

Replace images inside:

```
public/assets/containers/
```

Keep filenames the same (e.g. `500ml_white.jpg`, `750ml_black.jpg`). The app reads these paths from `src/data.js`.

## Notes

- The site uses a scrollable product rail with selectable colors.
- Clicking a product image opens a lightbox view.
