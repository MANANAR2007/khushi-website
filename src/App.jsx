import React, { useMemo, useState, useEffect, useRef } from 'react';
import { productCategories, stats, features, values } from './data.js';

const SECTION_IDS = ['home', 'about', 'products', 'sustainability', 'contact'];

function useScrollSpy() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handler = () => {
      const offset = 120;
      let current = 'home';
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY + offset >= top) {
          current = id;
        }
      });
      setActive(current);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return active;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function ProductCard({ categoryTitle, item, onOpen }) {
  const colorKeys = Object.keys(item.colors);
  const [color, setColor] = useState(colorKeys[0]);

  const imageSrc = item.colors[color];
  const bg = color === 'black' ? '#ffffff' : '#0b0c10';

  return (
    <div className="size-card">
      <button className="image-frame" type="button" onClick={() => onOpen(imageSrc, `${categoryTitle} · ${item.size} (${color})`)}>
        <div className="image-surface" style={{ background: bg }}>
          <img src={imageSrc} alt={`${categoryTitle} ${item.size}`} className="product-img" />
        </div>
      </button>
      <div className="size-info">
        <span className="size-name">{item.size}</span>
        <span className="size-price">₹ —</span>
      </div>
      <div className="color-selector">
        {colorKeys.map((key) => (
          <button
            key={key}
            type="button"
            className={`color-btn ${key} ${color === key ? 'active' : ''}`}
            aria-label={key}
            onClick={() => setColor(key)}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const active = useScrollSpy();
  const [lightbox, setLightbox] = useState({ open: false, src: '', caption: '' });

  const openLightbox = (src, caption) => {
    setLightbox({ open: true, src, caption });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox({ open: false, src: '', caption: '' });
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') closeLightbox();
    };
    if (lightbox.open) {
      document.addEventListener('keydown', handler);
    }
    return () => document.removeEventListener('keydown', handler);
  }, [lightbox.open]);

  return (
    <>
      <nav className="nav">
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            <img src={`${baseUrl}assets/containers/khushi_logo.svg.svg`} alt="khüshi" className="logo-img nav-logo-img" />
          </a>
          <ul className="nav-links">
            <li><a href="#home" className={active === 'home' ? 'active' : ''}>Home</a></li>
            <li><a href="#about" className={active === 'about' ? 'active' : ''}>About</a></li>
            <li><a href="#products" className={active === 'products' ? 'active' : ''}>Products</a></li>
            <li><a href="#sustainability" className={active === 'sustainability' ? 'active' : ''}>Sustainability</a></li>
            <li><a href="#contact" className={active === 'contact' ? 'active' : ''}>Contact</a></li>
          </ul>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-shell">
          <Reveal className="hero-content">
            <h1 className="hero-title">
              <img src={`${baseUrl}assets/containers/khushi_logo.svg.svg`} alt="khüshi" className="logo-img hero-logo-img" />
            </h1>
            <p className="hero-tagline">Food-grade. Recyclable. Reliable.</p>
          </Reveal>
          <Reveal className="hero-visual">
            <div className="hero-visual-inner">
              <div className="hero-badge">Food-Grade Certified</div>
              <div className="hero-panel">
                <div>
                  <h3>Packaging Excellence</h3>
                  <p>Precision-moulded solutions built for high-volume food brands across India.</p>
                </div>
                <div className="hero-points">
                  <span>ISO-grade materials</span>
                  <span>Leak-proof designs</span>
                  <span>Fast production cycles</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-container">
          <div className="about-header">
            <h2>About Khushi Containers</h2>
            <p className="about-tagline">Leading manufacturer of plastic injection moulded food packaging</p>
          </div>

          <div className="about-flow">
            <Reveal className="about-intro">
              <div className="about-intro-content">
                <p>Khushi Containers is a leading manufacturer of plastic injection moulded food packaging products, supported by advanced manufacturing technology to deliver high-quality solutions without compromise on material or process.</p>
                <p>The company caters to multiple market segments, including <strong>food manufacturers, QSRs, restaurants, dairies, sweet manufacturers, ice cream brands, and catering services</strong>, offering cost-optimized moulding solutions, consistent quality, and customized packaging for large-volume requirements.</p>
              </div>
              <div className="about-intro-image">
                <div className="image-placeholder"><span>Factory Image</span></div>
              </div>
            </Reveal>

            <Reveal className="about-manufacturing">
              <div className="manufacturing-content">
                <h3>Manufacturing Excellence</h3>
                <p>Our production unit is equipped with <strong>7 Toshiba injection moulding machines</strong>, ranging from 125T to 180T, designed for precision, speed, and long-term reliability, supported by state-of-the-art moulds and accessories.</p>
                <div className="stats-grid">
                  {stats.map((stat) => (
                    <div className="stat-card" key={stat.label}>
                      <span className="stat-number">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="manufacturing-image">
                <div className="image-placeholder large"><span>Machines Image</span></div>
              </div>
            </Reveal>

            <Reveal className="about-expertise">
              <div className="expertise-image">
                <div className="image-placeholder"><span>Manufacturing Image</span></div>
              </div>
              <div className="expertise-content">
                <h3>Our Expertise</h3>
                <p>Khushi Containers' expertise lies in advanced thin-wall polymer processing technologies, providing a strong foundation to develop <strong>lightweight, durable, and eco-friendly</strong> packaging solutions for the food and FMCG industries.</p>
                <p>Our manufacturing capabilities are engineered to deliver high strength with optimized material usage, ensuring efficiency without sacrificing performance.</p>
              </div>
            </Reveal>

            <Reveal className="about-thinwall">
              <h3>Thin-Wall Injection Moulding Specialists</h3>
              <p>We specialize in thin-wall injection moulding, processing wall thicknesses as low as <strong>0.38 mm</strong> while maintaining structural strength and dimensional accuracy. Our optimized processes achieve cycle times of approximately <strong>5 seconds</strong> on multi-cavity moulds, enabling high productivity without compromising quality or finish.</p>
              <p>This advanced manufacturing capability allows us to deliver <strong>lightweight, high-strength, leak-proof, and cost-effective</strong> containers at scale, while maintaining strict quality control across every production run.</p>
            </Reveal>

            <Reveal className="about-features">
              <h3>Product Quality</h3>
              <p className="features-intro">Our products are recognized for their functional designs, excellent material strength, and long-term durability.</p>
              <div className="features-grid">
                {features.map((feature) => (
                  <div className="feature-card" key={feature}>
                    <div className="feature-icon">✓</div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="about-values">
              <div className="values-image">
                <div className="image-placeholder"><span>Team Image</span></div>
              </div>
              <div className="values-content">
                <h3>Our Values</h3>
                <p>With a strong focus on <strong>timely delivery, ethical business practices, a customer-centric approach, and efficient logistics</strong>, Khushi Containers has established a reliable and respected presence in the food packaging segment.</p>
                <div className="values-list">
                  {values.map((item) => (
                    <div className="value-item" key={item.label}>
                      <span className="value-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="products" id="products">
        <div className="products-header">
          <h2>Our Products</h2>
          <p>Quality containers for every need</p>
        </div>
        {productCategories.map((category) => (
          <div className="product-category" key={category.title}>
            <h3 className="category-title">{category.title}</h3>
            <div className="scroll-container">
              <div className="scroll-track">
                {category.items.map((item) => (
                  <ProductCard
                    key={`${category.title}-${item.size}`}
                    categoryTitle={category.title}
                    item={item}
                    onOpen={openLightbox}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="sustainability" id="sustainability">
        <div className="sustainability-container">
          <h2>Sustainability</h2>
          <p className="sustainability-intro">Committed to responsible manufacturing and a greener future.</p>
          <div className="sustainability-grid">
            <Reveal className="sustainability-card">
              <div className="sustainability-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Food-Grade Safe</h3>
              <p>All our containers are made from 100% food-grade plastic, certified safe for storing all types of food items.</p>
            </Reveal>
            <Reveal className="sustainability-card">
              <div className="sustainability-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3>Fully Recyclable</h3>
              <p>Designed with sustainability in mind, every container can be fully recycled to minimize environmental impact.</p>
            </Reveal>
            <Reveal className="sustainability-card">
              <div className="sustainability-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Made in India</h3>
              <p>Proudly manufactured in India with responsible processes and reduced carbon footprint from local production.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-container">
          <h2>Get in Touch</h2>
          <p className="contact-intro">For inquiries and wholesale orders</p>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span>shreeindustries@gmail.com</span>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span>+91 94483 76318</span>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="contact-address">
                <span>No.8, Muthurayaswamy layout, Maruti Tent Rd, Muthuraya Swamy Extension, Sunkadakatte, Bengaluru, Karnataka 560091</span>
                <a
                  href="https://www.google.com/maps/place/Khushi+Containers+(Shree+Industries)/@12.9913546,77.5055003,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3dd99633bdd1:0xc8fc0e16e7624444!8m2!3d12.9913494!4d77.5080752!16s%2Fg%2F11vc2kqk5r?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-link"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <span className="footer-logo">
            <img src={`${baseUrl}assets/containers/khushi_logo.svg.svg`} alt="khüshi" className="logo-img footer-logo-img" />
          </span>
          <p>© 2026 khüshi. All rights reserved.</p>
        </div>
      </footer>

      {lightbox.open && (
        <div className="lightbox active" onClick={closeLightbox}>
          <button className="lightbox-close" aria-label="Close" onClick={closeLightbox}>&times;</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} className="lightbox-img" />
            <p className="lightbox-caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
