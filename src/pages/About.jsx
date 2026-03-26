import React, { useEffect, useRef, useState } from 'react';
import { BadgeCheck, CheckCircle2, Clock3, Truck, Users2, Shield, Factory } from 'lucide-react';

const machineImage = `${import.meta.env.BASE_URL}assets/machine.png`;

const productionStats = [
  { value: 80, decimals: 0, prefix: '', label: 'Metric Tonnes/Month' },
  { value: 0.38, decimals: 2, prefix: '', label: 'mm Wall Thickness' },
  { value: 5, decimals: 0, prefix: '~', label: 'Second Cycle Time' },
  { value: 7, decimals: 0, prefix: '', label: 'Toshiba Machines' },
  { value: 25, decimals: 0, prefix: '', label: 'Multi-cavity Moulds' }
];

const qualityPoints = [
  'Food-grade, BPA-free polymers',
  'Leak-proof and temperature-safe testing',
  'Cycle time optimization for consistent finish',
  'Batch traceability and hygiene compliance'
];

const qualityTags = ['ISO Standards', 'HACCP Ready', 'Recyclable Materials', 'Reusable'];

const values = [
  { icon: Clock3, title: 'Timely Delivery' },
  { icon: BadgeCheck, title: 'Ethical Practices' },
  { icon: Users2, title: 'Customer-Centric' },
  { icon: Truck, title: 'Efficient Logistics' }
];

function AnimatedStat({ value, decimals, prefix, label, active, className = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const duration = 1700;
    const start = performance.now();
    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  return (
    <div className={`flex flex-col text-center bg-slate-100 dark:bg-slate-800/60 p-5 rounded-2xl shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50 ${className}`}>
      <p className="text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
        {prefix}{display.toFixed(decimals)}
      </p>
      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default function About() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStatsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-surface-50 dark:bg-surface-950 font-sans text-slate-900 dark:text-slate-200 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* 1. INTRO (COMPACT HERO) */}
        <section className="py-12 lg:py-14 text-center max-w-3xl mx-auto">
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent-light dark:text-accent-light">
            About Khushi Containers
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            We manufacture food-grade plastic containers
          </h1>
          <p className="mt-4 text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            with consistent wall thickness, high-strength performance, and reliable delivery schedules.
          </p>
        </section>

        {/* 2. WHO WE SERVE */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black tracking-tight mb-3">Who We Serve</h2>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 max-w-4xl">
            Our packaging supports QSRs, dairies, dessert brands, catering services, and FMCG manufacturers looking for dependable, scalable food packaging.
          </p>
        </section>

        {/* 3. MATERIAL + CUSTOM */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="bg-surface-100 dark:bg-surface-900 p-5 lg:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-accent-light dark:text-accent-light" />
                </div>
                <h3 className="text-[17px] font-bold tracking-tight">Material Standards</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                We use BPA-free, food-safe polymers and maintain strict hygiene controls to meet ISO-aligned quality requirements.
              </p>
            </article>

            <article className="bg-surface-100 dark:bg-surface-900 p-5 lg:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-start h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                  <Factory className="w-5 h-5 text-accent-light dark:text-accent-light" />
                </div>
                <h3 className="text-[17px] font-bold tracking-tight">Custom Manufacturing</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                From tooling to bulk production, we provide custom moulding solutions for high-volume orders with consistent quality and quick turnaround.
              </p>
            </article>
          </div>
        </section>

        {/* 4. MANUFACTURING & QUALITY */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-10 max-w-4xl space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Manufacturing & Quality
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Precision injection moulding, ISO-aligned processes, and rigorous QC ensure reliable performance for every batch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Production Capability</h3>
              <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                Our facility runs 7 Toshiba injection moulding machines (125T–180T) to deliver thin-wall packaging with tight tolerances and consistent output.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Quality Assurance</h3>
              <ul className="space-y-3">
                {qualityPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent-light dark:text-accent-light shrink-0 mt-0.5" />
                    <span className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="py-8 bg-card dark:bg-surface-900/50 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-center mb-10">
            <img 
              src={machineImage} 
              alt="Manufacturing Machine" 
              className="max-w-md lg:max-w-lg w-full h-auto object-contain mx-auto mix-blend-multiply dark:mix-blend-screen px-4"
            />
          </div>

          <div className="space-y-8" ref={statsRef}>
            <div className="flex flex-wrap justify-center gap-4">
              {productionStats.map((stat) => (
                <AnimatedStat
                  key={stat.label}
                  {...stat}
                  active={statsVisible}
                  className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-0.8rem)]"
                />
              ))}
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              {qualityTags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest bg-slate-200/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-300 rounded-full border border-slate-300/50 dark:border-slate-700">
                  <BadgeCheck size={14} className="text-accent-light dark:text-accent-light" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PRODUCT QUALITY */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold tracking-tight">Product Quality</h2>
              <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
                Engineered for strength, hygiene, and repeatable performance.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {['100% Food-Grade', 'BPA-Free', 'Hygienic & Leak-Proof', 'Microwave Safe (100\u00B0C)', 'Freezer Safe'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4.5 h-4.5 text-accent-light dark:text-accent-light shrink-0" />
                  <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 6. SUSTAINABILITY */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Sustainability</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <article className="bg-surface-100 dark:bg-surface-900 p-5 lg:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col h-full">
                <h4 className="text-[15px] font-bold mb-2">Food-Grade Safe</h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  All our containers are made from 100% food-grade plastic, certified safe for storing all types of food items.
                </p>
              </article>
              
              <article className="bg-surface-100 dark:bg-surface-900 p-5 lg:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col h-full">
                <h4 className="text-[15px] font-bold mb-2">Fully Recyclable</h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Designed with sustainability in mind, every container can be fully recycled to minimize environmental impact.
                </p>
              </article>
              
              <article className="bg-surface-100 dark:bg-surface-900 p-5 lg:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col h-full">
                <h4 className="text-[15px] font-bold mb-2">Made in India</h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Proudly manufactured in India with responsible processes and reduced carbon footprint from local production.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 7. VALUES */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Our Values</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="bg-card dark:bg-surface-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/30 text-accent-light dark:text-accent-light flex items-center justify-center mb-3">
                      <Icon size={20} />
                    </div>
                    <span className="text-[14px] font-bold leading-tight">
                      {item.title}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
