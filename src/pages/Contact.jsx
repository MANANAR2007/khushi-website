import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const phonePrimary = '+91 9448376318';
const phoneSecondary = '+91 9844060140';
const email = 'shreeindustriesblr17@gmail.com';
const address =
  'No.8, Muthurayaswamy layout, Maruti Tent Rd, Muthuraya Swamy Extension, Sunkadakatte, Bengaluru, Karnataka 560091';
const mapLink =
  'https://www.google.com/maps/place/Khushi+Containers+(Shree+Industries)/@12.9913494,77.5080752,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae3dd99633bdd1:0xc8fc0e16e7624444!8m2!3d12.9913494!4d77.5080752!16s%2Fg%2F11vc2kqk5r';
const mapEmbedUrl = 'https://www.google.com/maps?q=12.9913494,77.5080752&output=embed';

export default function Contact() {
  const location = useLocation();
  const [productFocus, setProductFocus] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setProductFocus(params.get('product') || '');
  }, [location.search]);

  return (
    <div className="bg-surface-50 dark:bg-surface-950 font-sans min-h-screen">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-light dark:text-accent-light">Business Enquiries</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl lg:text-6xl">Contact Us</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Get in touch with us for custom manufacturing and business inquiries.
          </p>
        </div>
      </section>

      <section className="border-y border-slate-200/50 bg-surface-100 py-12 dark:border-surface-800 dark:bg-surface-900/40 md:py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:gap-8 lg:grid-cols-2 lg:px-8">
          <article className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-light dark:text-accent-light">Contact Details</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Let’s discuss your requirement</h2>
            </div>

            <div className="divide-y divide-slate-200/60 rounded-2xl bg-surface-50 shadow-sm dark:divide-surface-800 dark:bg-surface-950 border border-slate-200/40 dark:border-surface-800 relative z-10 transition-transform duration-500 hover:-translate-y-1">
              <div className="p-5">
                <div className="mb-2 flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-accent-light dark:text-accent-light" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Phone</p>
                </div>
                <div className="space-y-1 pl-7 text-base text-slate-600 dark:text-slate-300">
                  <a href="tel:+919448376318" className="block transition-all duration-300 hover:text-accent-light dark:hover:text-accent-light">
                    {phonePrimary}
                  </a>
                  <a href="tel:+919844060140" className="block transition-all duration-300 hover:text-accent-light dark:hover:text-accent-light">
                    {phoneSecondary}
                  </a>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-accent-light dark:text-accent-light" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</p>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="block pl-7 text-base text-slate-600 transition-all duration-300 hover:text-accent-light dark:text-slate-300 dark:hover:text-accent-light"
                >
                  {email}
                </a>
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent-light dark:text-accent-light" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Address</p>
                </div>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block pl-7 text-base leading-relaxed text-slate-600 transition-all duration-300 hover:text-accent-light dark:text-slate-300 dark:hover:text-accent-light"
                >
                  No.8, Muthurayaswamy layout, Maruti Tent Rd,
                  <br />
                  Muthuraya Swamy Extension, Sunkadakatte,
                  <br />
                  Bengaluru, Karnataka 560091
                </a>
              </div>
            </div>

            {productFocus && (
              <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-medium text-accent-light border border-brand-100 dark:bg-brand-900/30 dark:border-brand-800/40 dark:text-accent-light">
                Product inquiry: {productFocus}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+919448376318"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold tracking-wide !text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-brand-700 hover:shadow-xl dark:bg-brand-600 dark:hover:bg-brand-500 sm:w-auto"
              >
                Call Now
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-surface-50 px-6 py-3 text-sm font-semibold tracking-wide text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-surface-100 dark:border-surface-800 dark:bg-surface-950 dark:text-slate-300 dark:hover:bg-surface-900 sm:w-auto"
              >
                Send Email
              </a>
            </div>
          </article>

          <article className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 border border-slate-200/50 dark:border-surface-800 hover:scale-[1.02] hover:shadow-xl">
            <iframe
              title="Khushi Containers location map"
              src={mapEmbedUrl}
              loading="lazy"
              className="h-[320px] w-full sm:h-[360px] md:h-full md:min-h-[460px]"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold tracking-wide !text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-brand-700 hover:shadow-xl dark:bg-brand-600 dark:hover:bg-brand-500"
            >
              View on Google Maps
            </a>
          </article>
        </div>
      </section>

      <section className="py-10 md:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Manufacturing Support</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Dedicated support for recurring supply schedules and custom production requirements.
          </p>
        </div>
      </section>
    </div>
  );
}
