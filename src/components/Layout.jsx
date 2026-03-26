import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout({ theme, onToggleTheme, children }) {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/products/');

  return (
    <div className={`min-h-screen bg-main text-primary transition-colors duration-300 ${isProductDetail ? 'h-screen overflow-hidden flex flex-col' : ''}`}>
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <main className={isProductDetail ? 'flex-1 overflow-hidden h-full flex flex-col' : ''}>
        {children ?? <Outlet />}
      </main>
      {!isProductDetail && <Footer theme={theme} />}
    </div>
  );
}
