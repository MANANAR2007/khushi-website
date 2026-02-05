import React from 'react';
import styles from './Hero.module.css';
import logoUrl from '../assets/khushi_logo.svg';

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <img
            src={logoUrl}
            alt="khüshi"
            className={styles.logo}
          />
          <span className={styles.subBrand}>Containers</span>
          <p className={styles.tagline}>Food-grade. Recyclable. Reliable.</p>
          <span className={styles.scrollHint}>Scroll to explore</span>
        </div>
        <div className={styles.placeholder} aria-hidden="true">
          Manufacturing Visual
        </div>
      </div>
    </section>
  );
}
