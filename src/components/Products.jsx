import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Products.module.css';
import { productCategories } from '../data.js';
import RevealText from './RevealText.jsx';

const parseSrcSet = (srcSet) =>
  srcSet
    .split(',')
    .map((entry) => entry.trim().split(' ')[0])
    .filter(Boolean);

const preloadImages = (srcList) => {
  srcList.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

function ProductCard({ categoryTitle, item, onOpen }) {
  const colorKeys = Object.keys(item.colors);
  const [color, setColor] = useState(colorKeys[0]);
  const [displayImage, setDisplayImage] = useState(item.colors[colorKeys[0]]);
  const imgRef = useRef(null);
  const cardRef = useRef(null);
  const hasPreloaded = useRef(false);

  const imageData = item.colors[color];
  const surfaceClass = color === 'black' ? styles.surfaceLight : styles.surfaceDark;

  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasPreloaded.current) return;
          const sources = Object.values(item.colors).flatMap((img) => [
            img.src,
            ...parseSrcSet(img.srcSet)
          ]);
          preloadImages(sources);
          hasPreloaded.current = true;
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [item.colors]);

  const switchProductImage = (nextImage) => {
    const imgEl = imgRef.current;
    if (!imgEl) {
      setDisplayImage(nextImage);
      return;
    }

    if (prefersReducedMotion) {
      imgEl.src = nextImage.src;
      imgEl.srcset = nextImage.srcSet;
      imgEl.sizes = nextImage.sizes;
      imgEl.style.opacity = 1;
      return;
    }

    imgEl.style.opacity = 0;
    imgEl.onload = () => {
      requestAnimationFrame(() => {
        imgEl.style.opacity = 1;
      });
    };
    imgEl.src = nextImage.src;
    imgEl.srcset = nextImage.srcSet;
    imgEl.sizes = nextImage.sizes;
  };

  const handleColorChange = (key) => {
    if (key === color) return;
    setColor(key);
    switchProductImage(item.colors[key]);
  };

  const cardClasses = [styles.card, 'reveal'];

  return (
    <div
      className={cardClasses.join(' ')}
      ref={cardRef}
    >
      <button
        type="button"
        className={styles.imageButton}
        onClick={() => onOpen(imageData.srcLarge, `${categoryTitle} · ${item.size} (${color})`)}
      >
        <div className={`${styles.imageSurface} ${surfaceClass}`}>
          <div className={styles.productImageFrame}>
            <img
              ref={imgRef}
              src={displayImage.src}
              srcSet={displayImage.srcSet}
              sizes={displayImage.sizes}
              loading="lazy"
              decoding="async"
              alt=""
              className={styles.productImage}
              draggable="false"
            />
          </div>
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
        <header className={`${styles.header} reveal-group`}>
          <h2 className="section-title reveal reveal-fast">
            <RevealText text="Our Products" />
          </h2>
          <p className="section-subtitle reveal reveal-delay-1">Quality containers for every need</p>
          <div className="section-divider reveal reveal-delay-2" />
        </header>
      </div>
      <div>
        {productCategories.map((category) => (
          <div className={styles.category} key={category.title}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <div className={`${styles.scroll} ${category.title === 'ROUND CONTAINERS' ? styles.roundScroll : ''}`}>
              <div
                className={`${styles.track} reveal-group ${
                  category.title === 'ROUND CONTAINERS' ? styles.roundTrack : ''
                }`}
              >
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
