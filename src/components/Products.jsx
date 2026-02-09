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

function ProductCard({ categoryTitle, item, onOpen, isRound, onRoundRef }) {
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

  const cardClasses = [styles.card];
  if (isRound) {
    cardClasses.push(styles.roundCard);
  } else {
    cardClasses.push('reveal');
  }

  return (
    <div
      className={cardClasses.join(' ')}
      ref={(node) => {
        cardRef.current = node;
        if (isRound && onRoundRef) onRoundRef(node);
      }}
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
  const roundTrackRef = useRef(null);
  const roundCardsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = roundCardsRef.current.filter(Boolean);
    if (!cards.length) return undefined;

    if (prefersReducedMotion) {
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return undefined;
    }

    let rafId;
    const update = () => {
      const track = roundTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = rect.top + window.scrollY - viewport * 0.6;
      const span = Math.max(cards.length * 220, viewport * 0.6);
      const end = start + span;
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);

      cards.forEach((card, index) => {
        const segment = 1 / cards.length;
        const localProgress = Math.min(
          Math.max((progress - segment * index) / segment, 0),
          1
        );
        const opacity = localProgress;
        const translateY = (1 - localProgress) * 18;
        const scale = 0.94 + localProgress * 0.06;
        const rotate = (1 - localProgress) * -3;
        card.style.opacity = opacity.toFixed(3);
        card.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(
          3
        )}) rotate(${rotate.toFixed(2)}deg)`;
      });
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
        {productCategories.map((category) => {
          const isRound = category.title === 'ROUND CONTAINERS';
          if (isRound) roundCardsRef.current = [];
          return (
          <div className={styles.category} key={category.title}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <div className={styles.scroll} ref={isRound ? roundTrackRef : undefined}>
              <div className={`${styles.track} reveal-group`}>
                {category.items.map((item) => (
                  <ProductCard
                    key={`${category.title}-${item.size}`}
                    categoryTitle={category.title}
                    item={item}
                    onOpen={onOpen}
                    isRound={isRound}
                    onRoundRef={(node) => {
                      if (!node) return;
                      roundCardsRef.current.push(node);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </section>
  );
}
