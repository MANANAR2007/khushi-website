import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import logoUrl from '../assets/khushi_logo.svg';

const navLinks = [
  { href: '#products', label: 'Products' },
  { href: '#manufacturing', label: 'Manufacturing' },
  { href: '#quality', label: 'Quality' },
  { href: '#contact', label: 'Contact' }
];

export default function Header({ activeSection, theme, onToggleTheme, scrollProgress }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.logo} aria-label="Khushi home">
          <img src={logoUrl} alt="khüshi" />
        </a>

        <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={activeSection === link.href.slice(1) ? styles.active : ''}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="#contact" className={styles.cta}>
            Get Quote
          </a>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span className={styles.progressValue} style={{ width: `${scrollProgress}%` }} />
      </div>
      {open && (
        <button
          className={styles.backdrop}
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
