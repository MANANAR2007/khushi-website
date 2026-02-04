import React from 'react';
import styles from './About.module.css';
import { stats, values } from '../data.js';

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className="container">
        <header className={styles.header}>
          <h2 className="section-title">About Khushi Containers</h2>
          <p className="section-subtitle">Leading manufacturer of plastic injection moulded food packaging</p>
          <div className="section-divider" />
        </header>

        <div className={styles.flow}>
          <div className={styles.card}>
            <div>
              <p>Khushi Containers is a leading manufacturer of plastic injection moulded food packaging products, supported by advanced manufacturing technology to deliver high-quality solutions without compromise on material or process.</p>
              <p>The company caters to multiple market segments, including <strong>food manufacturers, QSRs, restaurants, dairies, sweet manufacturers, ice cream brands, and catering services</strong>, offering cost-optimized moulding solutions, consistent quality, and customized packaging for large-volume requirements.</p>
            </div>
            <div className={styles.imagePlaceholder}>
              <span>Factory Image</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.manufacturing}`}>
            <div>
              <h3>Manufacturing Excellence</h3>
              <p>Our production unit is equipped with <strong>7 Toshiba injection moulding machines</strong>, ranging from 125T to 180T, designed for precision, speed, and long-term reliability, supported by state-of-the-art moulds and accessories.</p>
              <div className={styles.statsGrid}>
                {stats.map((stat) => (
                  <div className={styles.statCard} key={stat.label}>
                    <span className={styles.statNumber}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.imagePlaceholderLarge}>
              <span>Machines Image</span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.imagePlaceholder}>
              <span>Manufacturing Image</span>
            </div>
            <div>
              <h3>Our Expertise</h3>
              <p>Khushi Containers' expertise lies in advanced thin-wall polymer processing technologies, providing a strong foundation to develop <strong>lightweight, durable, and eco-friendly</strong> packaging solutions for the food and FMCG industries.</p>
              <p>Our manufacturing capabilities are engineered to deliver high strength with optimized material usage, ensuring efficiency without sacrificing performance.</p>
            </div>
          </div>

          <div className={styles.thinwall}>
            <h3>Thin-Wall Injection Moulding Specialists</h3>
            <p>We specialize in thin-wall injection moulding, processing wall thicknesses as low as <strong>0.38 mm</strong> while maintaining structural strength and dimensional accuracy. Our optimized processes achieve cycle times of approximately <strong>5 seconds</strong> on multi-cavity moulds, enabling high productivity without compromising quality or finish.</p>
            <p>This advanced manufacturing capability allows us to deliver <strong>lightweight, high-strength, leak-proof, and cost-effective</strong> containers at scale, while maintaining strict quality control across every production run.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.imagePlaceholder}>
              <span>Team Image</span>
            </div>
            <div>
              <h3>Our Values</h3>
              <p>With a strong focus on <strong>timely delivery, ethical business practices, a customer-centric approach, and efficient logistics</strong>, Khushi Containers has established a reliable and respected presence in the food packaging segment.</p>
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
        </div>
      </div>
    </section>
  );
}
