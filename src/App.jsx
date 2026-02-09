import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Products from './components/Products.jsx';
import Manufacturing from './components/Manufacturing.jsx';
import Features from './components/Features.jsx';
import Sustainability from './components/Sustainability.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

const sections = ['home', 'about', 'products', 'manufacturing', 'sustainability', 'contact'];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('khushi-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [lightbox, setLightbox] = useState({ open: false, src: '', caption: '' });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('khushi-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Single IntersectionObserver for scroll reveals + section highlighting.
    const animatedElements = document.querySelectorAll('.reveal');
    const textElements = document.querySelectorAll('.reveal-text');
    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      animatedElements.forEach((el) => el.classList.add('in-view'));
      textElements.forEach((el) => el.classList.add('in-view'));
      document.documentElement.classList.add('hero-loaded');
    } else {
      requestAnimationFrame(() => {
        document.documentElement.classList.add('hero-loaded');
      });
    }

    const sectionRatios = new Map();
    sectionElements.forEach((el) => sectionRatios.set(el.id, 0));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          const isAnimated = target.classList.contains('reveal');
          const isText = target.classList.contains('reveal-text');

          if (isAnimated && entry.isIntersecting) {
            target.classList.add('in-view');
            observer.unobserve(target);
          }
          if (isText && entry.isIntersecting) {
            target.classList.add('in-view');
            observer.unobserve(target);
          }

          if (target.tagName === 'SECTION') {
            sectionRatios.set(target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        });

        let bestId = 'home';
        let bestRatio = 0;
        sectionRatios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestRatio > 0) {
          setActiveSection(bestId);
        }
      },
      { threshold: 0.2 }
    );

    sectionElements.forEach((el) => observer.observe(el));
    if (!prefersReducedMotion) {
      animatedElements.forEach((el) => observer.observe(el));
      textElements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = window.scrollY * -0.06;
        document.documentElement.style.setProperty('--parallax-offset', `${offset}px`);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setLightbox({ open: false, src: '', caption: '' });
        document.body.style.overflow = '';
      }
    };
    if (lightbox.open) {
      document.addEventListener('keydown', onKey);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox.open]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenLightbox = (src, caption) => {
    setLightbox({ open: true, src, caption });
    document.body.style.overflow = 'hidden';
  };

  const handleCloseLightbox = () => {
    setLightbox({ open: false, src: '', caption: '' });
    document.body.style.overflow = '';
  };

  return (
    <>
      <Header activeSection={activeSection} theme={theme} onToggleTheme={handleToggleTheme} />
      <main>
        <Hero />
        <About />
        <Products onOpen={handleOpenLightbox} />
        <Manufacturing />
        <Features />
        <Sustainability />
        <Contact />
      </main>
      <Footer />

      {lightbox.open && (
        <div className="lightbox" onClick={handleCloseLightbox} role="dialog" aria-modal="true">
          <button className="lightbox-close" aria-label="Close" onClick={handleCloseLightbox}>
            &times;
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} className="lightbox-img" />
            <p className="lightbox-caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
