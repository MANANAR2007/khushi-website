import React from 'react';
import styles from './Sustainability.module.css';

export default function Sustainability() {
  return (
    <section className={styles.section} id="sustainability">
      <div className="container">
        <header className={styles.header}>
          <h2 className="section-title fade-up">Sustainability</h2>
          <p className="section-subtitle">Committed to responsible manufacturing and a greener future.</p>
          <div className="section-divider" />
        </header>

        <div className={`${styles.grid} fade-up`}>
          <article className={styles.card}>
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3>Food-Grade Safe</h3>
            <p>All our containers are made from 100% food-grade plastic, certified safe for storing all types of food items.</p>
          </article>

          <article className={styles.card}>
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3>Fully Recyclable</h3>
            <p>Designed with sustainability in mind, every container can be fully recycled to minimize environmental impact.</p>
          </article>

          <article className={styles.card}>
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Made in India</h3>
            <p>Proudly manufactured in India with responsible processes and reduced carbon footprint from local production.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
