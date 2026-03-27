import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import logoLightUrl from '../assets/khushi_logo_light.svg';
import logoDarkUrl from '../assets/khushi_logo_dark.svg';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' }
];

export default function Header({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const logo = theme === 'dark' ? logoDarkUrl : logoLightUrl;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleNavClick = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-3 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? 'bg-card/90 border border-border/70 shadow-xl backdrop-blur-md'
            : 'bg-card/80 border border-border/60 shadow-md backdrop-blur-md'
        }`}
      >
        <Link to="/" onClick={handleNavClick} className="shrink-0" aria-label="Khushi home">
          <img src={logo} alt="Khushi Containers" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={`border-b-2 px-1 pb-1 text-[0.92rem] font-medium tracking-wide transition-all duration-300 ${
                  active
                    ? 'border-accent font-semibold text-accent-light'
                    : 'border-transparent text-secondary hover:text-accent-light'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full bg-section text-primary shadow-sm transition-all duration-300 hover:scale-105 hover:bg-card"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="/contact"
            onClick={handleNavClick}
            className="hidden rounded-xl bg-accent px-6 py-2.5 text-sm font-extrabold tracking-wide !text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-accent/90 hover:shadow-lg md:inline-flex"
          >
            Get Quote
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="grid h-9 w-9 place-items-center rounded-full bg-section text-primary shadow-sm transition-all duration-300 hover:scale-105 hover:bg-card md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <div
        className={`mx-auto mt-3 w-full max-w-7xl overflow-hidden rounded-2xl bg-card/95 border border-border/70 shadow-md backdrop-blur-md transition-all duration-300 md:hidden ${
          open ? 'max-h-80 translate-y-0 opacity-100' : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-2 p-3">
          {links.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={`rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-all duration-300 ${
                  active
                    ? 'bg-accent font-semibold text-white shadow-md'
                    : 'text-primary hover:text-accent-light'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          </div>
      </div>
    </header>
  );
}
