import React from 'react';
import styles from './Hero.module.css';
import logoUrl from '../assets/khushi_logo.svg';

export default function Hero() {
  return (
    <section className={`${styles.hero} hero-animate`} id="home">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <img
            src={logoUrl}
            alt="khüshi"
            className={`${styles.logo} hero-title`}
          />
          <span className={`${styles.subBrand} hero-subtext`}>Containers</span>
          <h1 className={`${styles.headline} hero-headline`}>Food-grade packaging built for modern food brands.</h1>
          <p className={`${styles.tagline} hero-tagline`}>
            Custom moulding, consistent quality, and reliable delivery for high-volume production.
          </p>
          <a className={styles.cta} href="#products">View Products</a>
        </div>
        <div className={styles.placeholder} aria-hidden="true">
          Precision injection moulding
        </div>
      </div>
    </section>
  );
}
