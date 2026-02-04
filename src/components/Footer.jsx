import React from 'react';
import styles from './Footer.module.css';
import logoUrl from '../assets/khushi_logo.svg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <img src={logoUrl} alt="khüshi" className={styles.logo} />
        <div className={styles.details}>
          <span>shreeindustries@gmail.com</span>
          <span>+91 94483 76318</span>
          <span>Bengaluru, Karnataka, India</span>
        </div>
        <p>© 2026 khüshi. All rights reserved.</p>
      </div>
    </footer>
  );
}
