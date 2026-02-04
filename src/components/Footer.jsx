import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <img src={`${baseUrl}assets/containers/khushi_logo.svg.svg`} alt="khüshi" className={styles.logo} />
        <p>© 2026 khüshi. All rights reserved.</p>
      </div>
    </footer>
  );
}
