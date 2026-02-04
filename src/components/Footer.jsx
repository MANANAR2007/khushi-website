import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const logoSrc = `${baseUrl}assets/containers/khushi_logo.svg`;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <img src={logoSrc} alt="khüshi" className={styles.logo} />
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
