import React from 'react';
import styles from './Hero.module.css';
import logoUrl from '../assets/khushi_logo.svg';

export default function Hero() {
  return (
    <section className={`${styles.hero} hero-animate ambient`} id="home">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <img
            src={logoUrl}
            alt="khüshi"
            className={`${styles.logo} hero-title`}
          />
          <span className={`${styles.subBrand} hero-subtext`}>Containers</span>
          <p className={`${styles.tagline} hero-tagline`}>Food-grade. Recyclable. Reliable.</p>
        </div>
        <div className={`${styles.placeholder} parallax-slow`} aria-hidden="true">
          Manufacturing Visual
        </div>
      </div>
    </section>
  );
}
