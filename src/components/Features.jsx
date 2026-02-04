import React from 'react';
import styles from './Features.module.css';
import { features } from '../data.js';

export default function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <header className={styles.header}>
          <h2 className="section-title fade-up">Product Quality</h2>
          <p className="section-subtitle">Engineered for strength, hygiene, and repeatable performance.</p>
          <div className="section-divider" />
        </header>
        <div className={`${styles.grid} fade-up`}>
          {features.map((feature) => (
            <div className={styles.card} key={feature}>
              <span className={styles.check}>✓</span>
              <h3>{feature}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
