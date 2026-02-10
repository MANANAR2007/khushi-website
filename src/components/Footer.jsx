import React from 'react';
import styles from './Footer.module.css';
import logoUrl from '../assets/khushi_logo.svg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandBlock}>
          <img src={logoUrl} alt="khüshi" className={styles.logo} />
          <p className={styles.descriptor}>
            Food-grade plastic container manufacturer focused on quality, consistency, and reliable bulk supply.
          </p>
          <p className={styles.copy}>© 2026 khüshi. All rights reserved.</p>
        </div>

        <div className={styles.block}>
          <h3>Contact</h3>
          <p>shreeindustriesblr17@gmail.com</p>
          <p>+91 94483 76318</p>
          <p>+91 98440 60140</p>
          <p>Bengaluru, Karnataka, India</p>
        </div>

        <div className={styles.block}>
          <h3>Navigate</h3>
          <a href="#products">Products</a>
          <a href="#manufacturing">Manufacturing</a>
          <a href="#quality">Quality</a>
          <a href="#contact">Contact</a>
        </div>

        <div className={styles.block}>
          <h3>Compliance</h3>
          <p>Food-grade polymers</p>
          <p>ISO-aligned process controls</p>
          <p>HACCP-ready production</p>
          <div className={styles.legal}>
            <a href="#home">Privacy</a>
            <a href="#home">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
