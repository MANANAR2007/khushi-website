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

function useScrollSpy() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handler = () => {
      const offset = 140;
      let current = 'home';
      sections.forEach((id) => {
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

export default function App() {
  const activeSection = useScrollSpy();
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
