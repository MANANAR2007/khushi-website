import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Factory, ShieldCheck, Truck, Users, Award } from 'lucide-react';

const machineImage = `${import.meta.env.BASE_URL}assets/machine.png`;
const heroImages = [
  `${import.meta.env.BASE_URL}assets/hero-carousel-new-1.png`,
  `${import.meta.env.BASE_URL}assets/hero-carousel-new-2.png`,
  `${import.meta.env.BASE_URL}assets/hero-carousel-new-3.png`,
  `${import.meta.env.BASE_URL}assets/hero-carousel-new-4.png`
];

const valuePoints = [
  {
    icon: ShieldCheck,
    title: 'Consistent Quality',
    text: 'Food-grade containers engineered for repeatable batch output.'
  },
  {
    icon: Factory,
    title: 'Manufacturing Depth',
    text: 'In-house process control and machine capacity for scale.'
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    text: 'Structured dispatch cycles that match procurement schedules.'
  }
];

function HomeStat({ label, value, active }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const duration = 1700;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
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
    <article className="rounded-2xl bg-card/80 p-6 shadow-md ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <p className="text-4xl font-bold tracking-tight text-primary">{display.toFixed(0)}</p>
      <p className="mt-2 text-sm font-medium tracking-wide text-secondary">{label}</p>
    </article>
  );
}

export default function Home() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const extendedImages = [...heroImages, heroImages[0]];

  const handleNextHero = () => {
    if (currentIndex === heroImages.length) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevHero = () => {
    if (currentIndex === 0) {
      setCurrentIndex(heroImages.length - 1);
      return;
    }
    if (currentIndex === heroImages.length) {
      setCurrentIndex(heroImages.length - 1);
      return;
    }
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === heroImages.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [currentIndex, isTransitioning]);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-section pt-16 pb-20 lg:pt-20 lg:pb-24">
        {/* Subtle Industrial Background Pattern & Depth */}
        <div
          className="absolute inset-0 opacity-25 [background-size:20px_20px]"
          style={{ backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)' }}
        />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-accent/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <article className="space-y-8 animate-[fadeInUp_0.8s_ease-out_forwards]">
            <p className="inline-flex rounded-full bg-card/60 border border-border/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-light backdrop-blur-sm shadow-sm">
              Premium B2B Manufacturing
            </p>

            <h1 className="max-w-xl text-2xl font-extrabold tracking-tight leading-[1.2] text-primary md:text-5xl lg:text-[56px]">
              Strong, reliable, food-grade plastic food containers you can trust.
            </h1>

            <div className="flex flex-wrap gap-3 mt-4">
              {[
                "Food-Grade",
                "Recyclable-Reusable",
                "Reliable"
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 bg-white border-gray-300 text-gray-800 shadow-sm dark:bg-white/5 dark:border-white/20 dark:text-white/80 dark:shadow-none backdrop-blur-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/80 tracking-wide">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold tracking-wide !text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-accent/90 hover:shadow-lg"
              >
                View Products <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-section/70 backdrop-blur-md border border-border px-8 py-4 text-base font-bold tracking-wide text-primary transition-all duration-300 hover:bg-section hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
            
            <p className="text-sm font-medium text-secondary flex items-center gap-2 mt-4">
              <ShieldCheck size={16} className="text-accent-light" /> Proudly serving FMCG, Dairy & Cloud Kitchens
            </p>
          </article>

          <article className="relative animate-[fadeIn_1.2s_ease-out_forwards]">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-accent/20 blur-3xl" />
            <div className="relative rounded-2xl bg-card/80 p-3 shadow-2xl ring-1 ring-border/60 backdrop-blur-sm transition-transform duration-500 hover:scale-[1.02]">
              <div className="overflow-hidden relative w-full h-full rounded-2xl aspect-[4/3]">
                <div
                  className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {extendedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Hero"
                      className="w-full h-full flex-shrink-0 object-contain"
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={handlePrevHero}
                className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-primary shadow-md ring-1 ring-border/60 transition hover:bg-card"
                aria-label="Previous hero image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNextHero}
                className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-primary shadow-md ring-1 ring-border/60 transition hover:bg-card"
                aria-label="Next hero image"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* TRUST SIGNALS SECTION */}
      <section className="bg-main py-12 border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
            
            <div className="flex sm:flex-row flex-col items-center gap-4 px-2 sm:px-4 text-center sm:text-left">
              <div className="h-14 w-14 shrink-0 rounded-full bg-brand-100 flex items-center justify-center">
                <ShieldCheck size={28} className="text-accent-light" />
              </div>
              <div>
                <p className="text-2xl font-black text-primary">ISO 9001</p>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-1">Certified Plant</p>
              </div>
            </div>
            
            <div className="flex sm:flex-row flex-col items-center gap-4 px-2 sm:px-4 text-center sm:text-left">
              <div className="h-14 w-14 shrink-0 rounded-full bg-brand-100 flex items-center justify-center">
                <Factory size={28} className="text-accent-light" />
              </div>
              <div>
                <p className="text-2xl font-black text-primary">15+ Years</p>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-1">Industry Legacy</p>
              </div>
            </div>

            <div className="flex sm:flex-row flex-col items-center gap-4 px-2 sm:px-4 text-center sm:text-left">
              <div className="h-14 w-14 shrink-0 rounded-full bg-brand-100 flex items-center justify-center">
                <Users size={28} className="text-accent-light" />
              </div>
              <div>
                <p className="text-2xl font-black text-primary">50+</p>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-1">B2B Clients</p>
              </div>
            </div>

            <div className="flex sm:flex-row flex-col items-center gap-4 px-2 sm:px-4 text-center sm:text-left">
              <div className="h-14 w-14 shrink-0 rounded-full bg-brand-100 flex items-center justify-center">
                <Award size={28} className="text-accent-light" />
              </div>
              <div>
                <p className="text-2xl font-black text-primary">100% Virgin</p>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-1">Food-Grade PP</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-main">
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xl font-semibold uppercase tracking-wide text-accent-light">About Khushi Containers</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
            We manufacture food-grade plastic containers
          </h2>
          <p className="mt-6 text-base leading-relaxed text-secondary">
            of different sizes, of round and rectangle shapes mainly available in three colours (black, white and transparent) with consistent wall thickness, high-strength performance, and reliable delivery schedules.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-semibold tracking-wide !text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-accent/90 hover:shadow-lg"
            >
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border/80 bg-section py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">Manufacturing</p>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Precision injection moulding with process discipline.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-secondary">
              ISO-aligned workflows and rigorous QC checkpoints ensure reliable performance for every production batch.
            </p>
            <Link
              to="/about"
              className="inline-flex text-sm font-semibold tracking-wide text-accent-light transition-all duration-300 hover:text-accent-light/80"
            >
              Explore our manufacturing standards
            </Link>
          </article>

          <article className="rounded-2xl bg-gradient-to-br from-card to-section p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <img
              src={machineImage}
              alt="Injection moulding machines"
              className="h-full w-full rounded-2xl object-cover transition-all duration-300 hover:scale-105"
            />
          </article>
        </div>
      </section>

      <section ref={statsRef} className="bg-gradient-to-br from-main to-section py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">Production Snapshot</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Capacity metrics that support dependable supply.
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <HomeStat label="Metric Tonnes / Month" value={80} active={statsVisible} />
            <HomeStat label="Toshiba Machines" value={7} active={statsVisible} />
          </div>
        </div>
      </section>

      <section className="border-y border-border/80 bg-main py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">Core Strengths</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Built for trust across every manufacturing cycle.
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {valuePoints.map((point) => {
              const Icon = point.icon;
              return (
                <article key={point.title} className="border-l-2 border-accent/60 pl-5">
                  <Icon className="text-accent-light" size={20} />
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-primary">{point.title}</h3>
                  <p className="mt-3 max-w-xs text-base leading-relaxed text-secondary">{point.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
