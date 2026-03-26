import React from 'react';
import { industries } from '../data.js';

export default function Industries() {
  return (
    <section className="section-block">
      <div className="site-shell">
        <div className="section-intro">
          <p className="eyebrow">Industry Focus</p>
          <h2>Packaging solutions tailored to high-pressure food and retail operations.</h2>
        </div>

        <div className="industry-grid">
          {industries.map((item) => (
            <article key={item.title} className="panel industry-card">
              <div className="industry-icon" aria-hidden="true">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
