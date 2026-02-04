import React, { useState } from 'react';
import styles from './Products.module.css';
import { productCategories } from '../data.js';

function ProductCard({ categoryTitle, item, onOpen }) {
  const colorKeys = Object.keys(item.colors);
  const [color, setColor] = useState(colorKeys[0]);

  const imageSrc = item.colors[color];
  const surfaceClass = color === 'black' ? styles.surfaceLight : styles.surfaceDark;

  return (
    <div className={styles.card}>
      <button
        type="button"
        className={styles.imageButton}
        onClick={() => onOpen(imageSrc, `${categoryTitle} · ${item.size} (${color})`)}
      >
        <div className={`${styles.imageSurface} ${surfaceClass}`}>
          <img src={imageSrc} alt={`${categoryTitle} ${item.size}`} />
        </div>
      </button>
      <div className={styles.sizeInfo}>
        <span className={styles.size}>{item.size}</span>
        <span className={styles.price}>₹ —</span>
      </div>
      <div className={styles.colors}>
        {colorKeys.map((key) => (
          <button
            key={key}
            type="button"
            className={`${styles.colorButton} ${styles[key]} ${color === key ? styles.active : ''}`}
            aria-label={key}
            onClick={() => setColor(key)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Products({ onOpen }) {
  return (
    <section className={styles.products} id="products">
      <div className="container">
        <header className={styles.header}>
          <h2 className="section-title fade-up">Our Products</h2>
          <p className="section-subtitle">Quality containers for every need</p>
          <div className="section-divider" />
        </header>
      </div>
      <div className="fade-up">
        {productCategories.map((category) => (
          <div className={styles.category} key={category.title}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <div className={styles.scroll}>
              <div className={styles.track}>
                {category.items.map((item) => (
                  <ProductCard
                    key={`${category.title}-${item.size}`}
                    categoryTitle={category.title}
                    item={item}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
