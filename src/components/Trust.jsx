import React from 'react';

const trustItems = [
  {
    title: 'Built for B2B Reliability',
    copy: 'Production-ready specs, strict QC checkpoints, and predictable lead times for procurement teams.'
  },
  {
    title: 'Design + Function',
    copy: 'High-clarity finish and stable stacking geometry to improve shelf presentation and logistics handling.'
  },
  {
    title: 'Scale Without Compromise',
    copy: 'From pilot batches to nationwide distribution, quality remains consistent across every dispatch.'
  }
];

export default function Trust() {
  return (
    <section className="section-block">
      <div className="site-shell trust-grid">
        {trustItems.map((item) => (
          <article key={item.title} className="panel">
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
