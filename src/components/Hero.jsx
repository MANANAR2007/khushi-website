import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <section className={styles.hero} id="home">
      <div className={`container ${styles.inner}`}>
        <div className={styles.centerpiece}>
          <img
            src={`${baseUrl}assets/containers/khushi_logo.svg`}
            alt="khüshi"
            className={styles.logo}
          />
          <p className={styles.tagline}>Food-grade. Recyclable. Reliable.</p>
          <span className={styles.scrollHint}>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
