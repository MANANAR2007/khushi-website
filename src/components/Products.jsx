import React, { useEffect, useState } from 'react';
import styles from './Products.module.css';
import { productCategories } from '../data.js';

function ProductCard({ categoryTitle, item, onOpen }) {
  const colorKeys = Object.keys(item.colors);
  const [color, setColor] = useState(colorKeys[0]);
  const [currentSrc, setCurrentSrc] = useState(item.colors[colorKeys[0]]);
  const [nextSrc, setNextSrc] = useState('');
  const [swapReady, setSwapReady] = useState(false);

  const imageSrc = item.colors[color];
  const surfaceClass = color === 'black' ? styles.surfaceLight : styles.surfaceDark;

  useEffect(() => {
    Object.values(item.colors).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [item.colors]);

  useEffect(() => {
    setCurrentSrc(item.colors[colorKeys[0]]);
    setNextSrc('');
    setSwapReady(false);
    setColor(colorKeys[0]);
  }, [item.colors, colorKeys]);

  const handleColorChange = (key) => {
    if (key === color) return;
    setColor(key);
    const nextImage = item.colors[key];
    if (nextImage === currentSrc) return;
    setNextSrc(nextImage);
    setSwapReady(false);
  };

  const handleNextLoad = () => {
    setSwapReady(true);
  };

  const handleSwapEnd = () => {
    if (!nextSrc) return;
    setCurrentSrc(nextSrc);
    setNextSrc('');
    setSwapReady(false);
  };

  return (
    <div className={`${styles.card} reveal`}>
      <button
        type="button"
        className={styles.imageButton}
        onClick={() => onOpen(imageSrc, `${categoryTitle} · ${item.size} (${color})`)}
      >
        <div className={`${styles.imageSurface} ${surfaceClass} ${nextSrc ? styles.swap : ''} ${swapReady ? styles.swapActive : ''}`}>
          <img
            src={currentSrc}
            alt={`${categoryTitle} ${item.size}`}
            className={styles.productImageBase}
            draggable="false"
          />
          {nextSrc && (
            <img
              src={nextSrc}
              alt={`${categoryTitle} ${item.size}`}
              className={styles.productImageNext}
              onLoad={handleNextLoad}
              onTransitionEnd={handleSwapEnd}
              draggable="false"
            />
          )}
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
            onClick={() => handleColorChange(key)}
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
          <h2 className="section-title reveal">Our Products</h2>
          <p className="section-subtitle">Quality containers for every need</p>
          <div className="section-divider" />
        </header>
      </div>
      <div>
        {productCategories.map((category) => (
          <div className={styles.category} key={category.title}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <div className={styles.scroll}>
              <div className={`${styles.track} reveal-group`}>
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
