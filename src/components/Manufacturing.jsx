import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Manufacturing.module.css';
import { stats } from '../data.js';
import RevealText from './RevealText.jsx';

export default function Manufacturing() {
  const gridRef = useRef(null);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const hasAnimated = useRef(false);

  const statMeta = useMemo(
    () =>
      stats.map((stat) => {
        const numeric = parseFloat(String(stat.value).replace(/[^0-9.]/g, '')) || 0;
        const hasApprox = String(stat.value).includes('~');
        return { numeric, hasApprox, raw: stat.value };
      }),
    []
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCounts(statMeta.map((meta) => meta.numeric));
      return undefined;
    }

    const target = gridRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasAnimated.current) return;
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const nextCounts = statMeta.map((meta) => meta.numeric * progress);
            setCounts(nextCounts);
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [statMeta]);

  return (
    <section className={`${styles.section} ambient`} id="manufacturing">
      <div className="container">
        <header className={`${styles.header} reveal-group`}>
          <h2 className="section-title reveal reveal-slow">
            <RevealText text="Manufacturing & Quality" />
          </h2>
          <p className="section-subtitle reveal reveal-delay-1">
            Precision injection moulding, ISO-aligned processes, and rigorous QC ensure reliable performance for every batch.
          </p>
          <div className="section-divider reveal reveal-delay-2" />
        </header>

        <div className={`${styles.layout} reveal-group`}>
          <div className={`${styles.panel} reveal`}>
            <h3>Production Capability</h3>
            <p>
              Our facility runs 7 Toshiba injection moulding machines (125T–180T) to deliver thin-wall packaging with tight tolerances and consistent output.
            </p>
            <div className={styles.statsGrid} ref={gridRef}>
              {stats.map((stat, index) => {
                const meta = statMeta[index];
                const value = meta.numeric < 1
                  ? counts[index].toFixed(2)
                  : Math.round(counts[index]).toString();
                const display = meta.hasApprox ? `~${value}` : value;
                return (
                <div className={styles.statCard} key={stat.label}>
                  <span className={styles.statNumber}>{display}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
                );
              })}
            </div>
          </div>
          <div className={`${styles.panelAlt} reveal`}>
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
          </div>
        </div>
        <div className={`${styles.machinePlaceholder} parallax-slow`}>Machine Image</div>
      </div>
    </section>
  );
}
