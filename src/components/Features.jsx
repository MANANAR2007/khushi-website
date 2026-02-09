import React from 'react';
import styles from './Features.module.css';
import { features } from '../data.js';

export default function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <header className={styles.header}>
          <h2 className="section-title reveal">Quality Assurance</h2>
          <p className="section-subtitle">Engineered for hygiene, durability, and repeatable performance.</p>
          <div className="section-divider" />
        </header>
        <div className={`${styles.grid} reveal-group`}>
          {features.map((feature) => (
            <div className={`${styles.card} reveal`} key={feature}>
              <span className={styles.check}>✓</span>
              <h3>{feature}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
