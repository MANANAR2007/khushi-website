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
          <h1 className={`${styles.headline} hero-headline`}>Food-Grade Packaging Built for Scale.</h1>
          <p className={`${styles.tagline} hero-tagline`}>Food-grade. Recyclable. Reliable.</p>
          <div className={styles.ctaRow}>
            <a className={styles.cta} href="#contact">Get a Quote</a>
            <span className={styles.ctaNote}>Custom moulding • Bulk orders • ISO-aligned QC</span>
          </div>
        </div>
        <div className={styles.placeholder} aria-hidden="true">
          Production Line Visual
        </div>
      </div>
    </section>
  );
}
