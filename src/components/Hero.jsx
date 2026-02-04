import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <section className={styles.hero} id="home">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <img src={`${baseUrl}assets/containers/khushi_logo.svg.svg`} alt="khüshi" className={styles.logo} />
          <p className={styles.tagline}>Food-grade. Recyclable. Reliable.</p>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.visualRing} />
          <div className={styles.visualCard} />
          <div className={styles.visualBadge}>Food-Grade</div>
        </div>
      </div>
    </section>
  );
}
