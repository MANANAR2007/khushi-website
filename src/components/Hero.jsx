import React from 'react';
import styles from './Hero.module.css';
import logoUrl from '../assets/khushi_logo.svg';

export default function Hero() {
  return (
    <section className={`${styles.hero} hero-animate ambient`} id="home">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <img src={logoUrl} alt="khüshi" className={`${styles.logo} hero-title`} />
          <span className={`${styles.subBrand} hero-subtext`}>Containers</span>
          <p className={`${styles.tagline} hero-tagline`}>Food-grade. Recyclable. Reliable.</p>
          <h1 className={`${styles.heading} hero-tagline`}>
            Food-grade plastic container manufacturing for high-volume businesses.
          </h1>
          <p className={`${styles.support} hero-tagline`}>
            Precision moulding, dependable quality control, and on-time bulk supply from Bengaluru.
          </p>
          <div className={styles.ctaRow}>
            <a href="#products" className={styles.ctaPrimary}>View Products</a>
            <a href="#contact" className={styles.ctaSecondary}>Contact Us</a>
          </div>
        </div>
        <div className={`${styles.placeholder} parallax-slow`} aria-hidden="true">
          Manufacturing Visual
        </div>
      </div>
    </section>
  );
}
