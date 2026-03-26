import React from 'react';
import { Link } from 'react-router-dom';
import logoLightUrl from '../assets/khushi_logo_light.svg';
import logoDarkUrl from '../assets/khushi_logo_dark.svg';

export default function Footer({ theme }) {
  const year = new Date().getFullYear();
  const logo = theme === 'dark' ? logoDarkUrl : logoLightUrl;

  return (
    <footer className="w-full border-t border-border/70 bg-main py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <img src={logo} alt="Khushi Containers" className="h-8 w-auto" />
          <p className="max-w-md text-sm font-medium leading-relaxed text-secondary">
            Premium food packaging solutions for manufacturing, retail, and distribution businesses.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-6">
          <div className="flex flex-wrap items-center gap-5 text-sm font-bold tracking-wide text-secondary">
            <Link to="/products" className="transition-colors duration-300 hover:text-accent-light">Products</Link>
            <Link to="/about" className="transition-colors duration-300 hover:text-accent-light">About</Link>
            <Link to="/contact" className="transition-colors duration-300 hover:text-accent-light">Contact</Link>
            <span className="text-secondary/80">© {year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
