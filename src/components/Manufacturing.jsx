import React from 'react';
import styles from './Manufacturing.module.css';
import { stats } from '../data.js';

export default function Manufacturing() {
  return (
    <section className={styles.section} id="manufacturing">
      <div className="container">
        <header className={styles.header}>
          <h2 className="section-title reveal">Manufacturing & Quality</h2>
          <p className="section-subtitle">
            Precision injection moulding, ISO-aligned processes, and rigorous QC ensure reliable performance for every batch.
          </p>
          <div className="section-divider" />
        </header>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <h3>Production Capability</h3>
            <p>
              Our facility runs 7 Toshiba injection moulding machines (125T–180T) to deliver thin-wall packaging with tight tolerances and consistent output.
            </p>
            <div className={styles.statsGrid}>
              {stats.map((stat) => (
                <div className={styles.statCard} key={stat.label}>
                  <span className={styles.statNumber}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.panelAlt}>
            <h3>Quality Assurance</h3>
            <ul>
              <li>Food-grade, BPA-free polymers</li>
              <li>Leak-proof and temperature-safe testing</li>
              <li>Cycle time optimization for consistent finish</li>
              <li>Batch traceability and hygiene compliance</li>
            </ul>
            <div className={styles.badges}>
              <span>ISO Standards</span>
              <span>HACCP Ready</span>
              <span>Recyclable Materials</span>
            </div>
            <div className={`${styles.machinePlaceholder} reveal`}>Machine Image</div>
          </div>
        </div>
      </div>
    </section>
  );
}
