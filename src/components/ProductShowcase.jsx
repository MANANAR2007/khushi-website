import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { productCategories } from '../data.js';

function swatchStyle(color) {
  if (color === 'white') return { background: 'var(--color-card)', borderColor: 'var(--color-border)' };
  if (color === 'black') return { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' };
  return {
    background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-section) 85%, transparent), color-mix(in srgb, var(--color-card) 70%, transparent))',
    borderColor: 'var(--color-border)'
  };
}

function FeaturedCard({ product }) {
  const colorKeys = Object.keys(product.colors);
  const [activeColor, setActiveColor] = useState(colorKeys[0]);
  const image = product.colors[activeColor] || product.colors[colorKeys[0]];
  const slug = `${product.category.split(' ')[0].toLowerCase()}-${product.size}`;

  return (
    <article className="product-card featured-card">
      <div className="product-image-frame featured-image-frame">
        <img src={image.src} alt={`${product.size} ${activeColor} ${product.category}`} loading="lazy" />
      </div>
      <div className="product-body">
        <p className="product-family">{product.category}</p>
        <h3>{product.size} Container</h3>
        <div className="color-dots color-switcher">
          {colorKeys.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-dot-button ${activeColor === color ? 'is-active' : ''}`}
              onClick={() => setActiveColor(color)}
              aria-label={`Show ${color} variant`}
              title={color}
            >
              <span className="color-dot" style={swatchStyle(color)} />
            </button>
          ))}
        </div>
        <Link to={`/products/${slug}`} className="text-link">Open product sheet</Link>
      </div>
    </article>
  );
}

export default function ProductShowcase() {
  const featuredProducts = useMemo(() => {
    const allProducts = productCategories.flatMap((category) =>
      category.items.map((item) => ({ ...item, category: category.title }))
    );
    return allProducts.slice(0, 3);
  }, []);

  return (
    <section className="section-block">
      <div className="site-shell">
        <div className="section-intro">
          <p className="eyebrow">Featured Products</p>
          <h2>Switch colors instantly and preview each container variant.</h2>
        </div>

        <div className="featured-product-grid">
          {featuredProducts.map((product) => (
            <FeaturedCard
              key={`${product.category}-${product.size}`}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
