import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Recycle, Factory } from 'lucide-react';
import { stats } from '../data.js';

const images = [
  `${import.meta.env.BASE_URL}assets/hero-manufacturing.jpg`,
  'https://images.unsplash.com/photo-1537884444401-d7af916eb0c9?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop'
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="site-shell hero-layout">
        <div className="hero-content">
          <p className="eyebrow">Industrial Packaging Partner</p>
          <h1>Corporate-grade food containers for brands that operate at scale.</h1>
          <p className="hero-lead">
            Khushi manufactures premium injection-moulded containers engineered for shelf appeal,
            leak-proof transport, and repeatable production quality.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="button">
              Explore Catalog <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="button button-ghost">
              Talk to Sales
            </Link>
          </div>

          <div className="hero-badges">
            <span><ShieldCheck size={16} /> Food-safe material</span>
            <span><Recycle size={16} /> Fully recyclable</span>
            <span><Factory size={16} /> High-volume output</span>
          </div>
        </div>

        <div className="hero-visual-wrap relative overflow-hidden group">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />

          {/* SINGLE IMAGE RENDERING LOGIC AS REQUESTED */}
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Manufacturing facility visual"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 animate-[fadeIn_0.5s_ease-out]"
            loading="eager"
          />

          <div className="hero-kpi-grid relative z-20">
            {stats.map((item) => (
              <article key={item.label} className="hero-kpi bg-card/90 backdrop-blur-md">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
