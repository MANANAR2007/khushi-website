import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout({ theme, onToggleTheme, children }) {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/products/');

  return (
    <div className="min-h-screen flex flex-col bg-main text-primary transition-colors duration-300">
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <main className={isProductDetail ? 'flex-1 overflow-y-auto' : 'flex-1'}>
        {children ?? <Outlet />}
      </main>
      {!isProductDetail && <Footer theme={theme} />}
    </div>
  );
}
