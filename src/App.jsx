import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
    gsap.registerPlugin(ScrollTrigger);

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

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 900px)').matches;

      gsap.utils.toArray('.liquid-blob').forEach((blob, index) => {
        gsap.to(blob, {
          x: index % 2 === 0 ? 60 : -50,
          y: index % 2 === 0 ? -40 : 50,
          rotation: index % 2 === 0 ? 10 : -8,
          duration: 18 + index * 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      });

      gsap.utils.toArray('.reveal-text').forEach((textBlock) => {
        const words = textBlock.querySelectorAll('.reveal-word');
        if (!words.length) return;
        gsap.fromTo(
          words,
          {
            color: 'var(--color-muted)',
            textShadow: '0 0 0 rgba(240, 122, 43, 0)'
          },
          {
            color: 'var(--color-text)',
            textShadow: '0 0 18px rgba(240, 122, 43, 0.35)',
            stagger: 0.08,
            scrollTrigger: {
              trigger: textBlock,
              start: 'top 85%',
              end: 'bottom 60%',
              scrub: true
            }
          }
        );
      });

      gsap.utils.toArray('section').forEach((section, index) => {
        gsap.fromTo(
          section,
          { skewY: index % 2 === 0 ? 0.6 : -0.6 },
          {
            skewY: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true
            }
          }
        );
      });

      const roundScroller = document.querySelector('.round-scroller');
      const roundCards = gsap.utils.toArray('.round-card');
      if (roundScroller && roundCards.length && !isMobile) {
        gsap.set(roundCards, { opacity: 0, y: 24, scale: 0.96, rotate: -3 });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: roundScroller,
            start: 'top 75%',
            end: `+=${roundCards.length * 220}`,
            scrub: true,
            pin: roundScroller,
            anticipatePin: 1
          }
        });
        roundCards.forEach((card) => {
          timeline.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 1,
            ease: 'power2.out'
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const cursorOrb = document.querySelector('.cursor-orb');
    const blobs = gsap.utils.toArray('.liquid-blob');
    const blobSetters = blobs.map((blob) => ({
      x: gsap.quickSetter(blob, 'x', 'px'),
      y: gsap.quickSetter(blob, 'y', 'px')
    }));
    const distortItems = Array.from(document.querySelectorAll('.cursor-distort'));
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      if (cursorOrb) {
        cursorOrb.style.transform = `translate3d(${currentX - 110}px, ${currentY - 110}px, 0)`;
      }
      document.documentElement.style.setProperty('--cursor-x', `${currentX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${currentY}px`);
      blobSetters.forEach((setter, index) => {
        const strength = (index + 1) * 0.02;
        setter.x((currentX - window.innerWidth / 2) * strength);
        setter.y((currentY - window.innerHeight / 2) * strength);
      });
      distortItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = currentX - centerX;
        const dy = currentY - centerY;
        const distance = Math.hypot(dx, dy);
        const strength = Math.max(0, 1 - distance / 420);
        const glow = (10 * strength).toFixed(2);
        item.style.textShadow = `0 0 ${glow}px rgba(240, 122, 43, ${0.45 * strength})`;
        item.style.filter = `brightness(${1 + 0.12 * strength})`;
      });
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    const magneticItems = document.querySelectorAll('.magnetic');
    const magneticHandlers = [];
    magneticItems.forEach((item) => {
      const move = (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(item, { x: x * 0.18, y: y * 0.18, duration: 0.3, ease: 'power3.out' });
      };
      const reset = () => {
        gsap.to(item, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
      };
      item.addEventListener('pointermove', move);
      item.addEventListener('pointerleave', reset);
      magneticHandlers.push({ item, move, reset });
    });

    const tiltItems = document.querySelectorAll('.tilt-surface');
    const tiltHandlers = [];
    tiltItems.forEach((item) => {
      const move = (event) => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const tiltX = (-y * 10).toFixed(2);
        const tiltY = (x * 10).toFixed(2);
        item.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };
      const reset = () => {
        item.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      };
      item.addEventListener('pointermove', move);
      item.addEventListener('pointerleave', reset);
      tiltHandlers.push({ item, move, reset });
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
      magneticHandlers.forEach(({ item, move, reset }) => {
        item.removeEventListener('pointermove', move);
        item.removeEventListener('pointerleave', reset);
      });
      tiltHandlers.forEach(({ item, move, reset }) => {
        item.removeEventListener('pointermove', move);
        item.removeEventListener('pointerleave', reset);
      });
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (prefersReducedMotion || isMobile) return undefined;

    let current = window.scrollY;
    let target = window.scrollY;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let rafId;

    const onWheel = (event) => {
      event.preventDefault();
      target += event.deltaY;
      target = Math.max(0, Math.min(target, maxScroll));
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    const update = () => {
      current += (target - current) * 0.08;
      if (Math.abs(target - current) < 0.5) {
        current = target;
      }
      window.scrollTo(0, current);
      if (current !== target) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    };

    const onResize = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(target, maxScroll));
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
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
      <div className="liquid-layer" aria-hidden="true">
        <div className="liquid-blob blob-1" />
        <div className="liquid-blob blob-2" />
        <div className="liquid-blob blob-3" />
      </div>
      <div className="cursor-orb" aria-hidden="true" />
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
