import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <section className={styles.hero} id="home">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <span className={styles.kicker}>Food-Grade Packaging Specialists</span>
          <h1>Reliable Plastic Container Manufacturing for High-Volume Brands</h1>
          <p>
            Khushi Containers supplies food-safe, recyclable packaging engineered for consistency,
            leak-proof performance, and large-scale production.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#contact">
              Get a Quote
            </a>
            <a className={styles.secondary} href="#products">
              View Products
            </a>
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <img src={`${baseUrl}assets/containers/round/750ml_black.jpg`} alt="" />
          <div className={styles.visualBadge}>ISO-Compliant</div>
        </div>
      </div>
    </section>
  );
}
