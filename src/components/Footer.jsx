import React from 'react';
import styles from './Footer.module.css';
import logoUrl from '../assets/khushi_logo.svg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <img src={logoUrl} alt="khüshi" className={styles.logo} />
        <p>© 2026 khüshi. All rights reserved.</p>
      </div>
    </footer>
  );
}
