# Khüshi Website - Image Setup Guide

## Adding Your Product Images

The website is set up to display your actual product photos. You need to add your images to the following folder structure:

```
khushi-website/
└── assets/
    └── containers/
        ├── round/
        │   ├── 250ml-white.png
        │   ├── 250ml-black.png
        │   ├── 250ml-transparent.png
        │   ├── 500ml-white.png
        │   ├── 500ml-black.png
        │   ├── 500ml-transparent.png
        │   ├── 750ml-white.png
        │   ├── 750ml-black.png
        │   ├── 750ml-transparent.png
        │   ├── 1000ml-white.png
        │   ├── 1000ml-black.png
        │   ├── 1000ml-transparent.png
        │   ├── 1500ml-white.png
        │   ├── 1500ml-black.png
        │   └── 1500ml-transparent.png
        │
        ├── rectangle/
        │   ├── 300ml-white.png
        │   ├── 300ml-black.png
        │   ├── 300ml-transparent.png
        │   ├── 500ml-white.png
        │   ├── 500ml-black.png
        │   ├── 500ml-transparent.png
        │   ├── 750ml-white.png
        │   ├── 750ml-black.png
        │   ├── 750ml-transparent.png
        │   ├── 1000ml-white.png
        │   ├── 1000ml-black.png
        │   ├── 1000ml-transparent.png
        │   ├── 1500ml-white.png
        │   ├── 1500ml-black.png
        │   ├── 1500ml-transparent.png
        │   ├── 2000ml-white.png
        │   ├── 2000ml-black.png
        │   └── 2000ml-transparent.png
        │
        └── bowl/
            ├── 200ml-white.png
            ├── 200ml-black.png
            ├── 200ml-transparent.png
            ├── 400ml-white.png
            ├── 400ml-black.png
            ├── 400ml-transparent.png
            ├── 650ml-white.png
            ├── 650ml-black.png
            ├── 650ml-transparent.png
            ├── 900ml-white.png
            ├── 900ml-black.png
            ├── 900ml-transparent.png
            ├── 1200ml-white.png
            ├── 1200ml-black.png
            └── 1200ml-transparent.png
```

## Image Requirements

- **Format**: PNG (recommended for transparent backgrounds) or JPG
- **Size**: Recommended 400x400px or larger (square aspect ratio works best)
- **Background**: Transparent or neutral grey background
- **Naming**: Must match exactly: `{size}-{color}.png`
  - Size examples: `250ml`, `500ml`, `1000ml`
  - Colors: `white`, `black`, `transparent`

## How It Works

1. When a user clicks a color button (white/black/transparent), the corresponding image is displayed
2. Only the active image is visible, others are hidden
3. Images swap instantly without page reload

## Running the Website

```bash
cd khushi-website
npx serve -l 3000
```

Then open http://localhost:3000 in your browser.
