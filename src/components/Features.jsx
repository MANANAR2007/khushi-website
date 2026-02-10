import React from 'react';
import styles from './Features.module.css';
import { features } from '../data.js';
import RevealText from './RevealText.jsx';

export default function Features() {
  return (
    <section className={`${styles.features} ambient`} id="quality">
      <div className="container">
        <header className={`${styles.header} reveal-group`}>
          <h2 className="section-title reveal reveal-fast">
            <RevealText text="Product Quality" />
          </h2>
          <p className="section-subtitle reveal reveal-delay-1">
            Engineered for strength, hygiene, and repeatable performance.
          </p>
          <div className="section-divider reveal reveal-delay-2" />
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
