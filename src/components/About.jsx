import React from 'react';
import styles from './About.module.css';
import { values } from '../data.js';
import RevealText from './RevealText.jsx';

export default function About() {
  return (
    <section className={`${styles.about} ambient`} id="about">
      <div className="container">
        <header className={`${styles.header} reveal-group`}>
          <h2 className="section-title reveal reveal-slow cursor-distort">
            <RevealText text="About Khushi Containers" />
          </h2>
          <p className="section-subtitle reveal reveal-delay-1 cursor-distort">
            We manufacture food-grade plastic containers with consistent wall thickness, high-strength performance, and reliable delivery schedules.
          </p>
          <div className="section-divider reveal reveal-delay-2" />
        </header>

        <div className={`${styles.grid} reveal-group`}>
          <article className={`${styles.card} reveal`}>
            <h3>Who We Serve</h3>
            <p>
              Our packaging supports QSRs, dairies, dessert brands, catering services, and FMCG manufacturers looking for dependable, scalable food packaging.
            </p>
          </article>
          <article className={`${styles.card} reveal`}>
            <h3>Material Standards</h3>
            <p>
              We use BPA-free, food-safe polymers and maintain strict hygiene controls to meet ISO-aligned quality requirements.
            </p>
          </article>
          <article className={`${styles.card} reveal`}>
            <h3>Custom Manufacturing</h3>
            <p>
              From tooling to bulk production, we provide custom moulding for high-volume orders with consistent quality and quick turnaround.
            </p>
          </article>
        </div>

        <div className={styles.values}>
          <div>
            <h3>Our Values</h3>
            <p>
              We prioritize on-time delivery, ethical partnerships, and long-term customer success through efficient logistics and dependable service.
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
