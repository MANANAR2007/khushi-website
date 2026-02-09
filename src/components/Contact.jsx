import React from 'react';
import styles from './Contact.module.css';
import RevealText from './RevealText.jsx';

export default function Contact() {
  return (
    <section className={`${styles.contact} ambient`} id="contact">
      <div className="container">
        <header className={`${styles.header} reveal-group`}>
          <h2 className="section-title reveal reveal-fast">
            <RevealText text="Get a Quote" />
          </h2>
          <p className="section-subtitle reveal reveal-delay-1">
            Tell us your volume requirements and packaging specifications. We respond with pricing and lead times.
          </p>
          <div className="section-divider reveal reveal-delay-2" />
        </header>

        <div className={`${styles.grid} reveal`}>
          <div className={styles.item}>
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span>shreeindustriesblr17@gmail.com</span>
          </div>

          <div className={styles.item}>
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className={styles.phoneList}>
              <span>+91 94483 76318</span>
              <span>+91 98440 60140</span>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className={styles.address}>
              <span>No.8, Muthurayaswamy layout, Maruti Tent Rd, Muthuraya Swamy Extension, Sunkadakatte, Bengaluru, Karnataka 560091</span>
              <a
                href="https://www.google.com/maps/place/Khushi+Containers+(Shree+Industries)/@12.9913546,77.5055003,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3dd99633bdd1:0xc8fc0e16e7624444!8m2!3d12.9913494!4d77.5080752!16s%2Fg%2F11vc2kqk5r?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
