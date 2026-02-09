import React from 'react';
import styles from './About.module.css';
import { values } from '../data.js';

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className="container">
        <header className={styles.header}>
          <h2 className="section-title reveal">Our Philosophy</h2>
          <p className="section-subtitle">
            We build food-grade containers with a focus on consistency, hygiene, and dependable supply for high-volume food brands.
          </p>
          <div className="section-divider" />
        </header>

        <div className={`${styles.grid} reveal-group`}>
          <article className={`${styles.card} reveal`}>
            <h3>Who We Serve</h3>
            <p>
              QSRs, dairies, dessert brands, caterers, and FMCG manufacturers who need dependable packaging at scale.
            </p>
          </article>
          <article className={`${styles.card} reveal`}>
            <h3>Material Standards</h3>
            <p>
              BPA-free, food-safe polymers with cleanroom-grade handling and ISO-aligned process controls.
            </p>
          </article>
          <article className={`${styles.card} reveal`}>
            <h3>Custom Manufacturing</h3>
            <p>
              From tooling to bulk production, we deliver custom moulding with consistent quality and tight lead times.
            </p>
          </article>
        </div>

        <div className={styles.values}>
          <div>
            <h3>Our Values</h3>
            <p>
              We prioritize on-time delivery, ethical partnerships, and long-term customer success.
            </p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div className={styles.valueItem} key={value.label}>
                <span className={styles.valueIcon}>{value.icon}</span>
                <span>{value.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
