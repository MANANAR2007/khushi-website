import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('khushi-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark'); // Tailwind dark mode
    localStorage.setItem('khushi-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const scrollY = window.scrollY;
    
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      
      // Proactively update DOM to prevent flash or jump before React commits
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('khushi-theme', next);
      
      // Force frame-level scroll restoration
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
      
      return next;
    });
  };

  return (
    <Layout theme={theme} onToggleTheme={handleToggleTheme}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MotionWrapper><Home /></MotionWrapper>} />
          <Route path="/products" element={<MotionWrapper><Products /></MotionWrapper>} />
          <Route path="/products/:id" element={<MotionWrapper><ProductDetail /></MotionWrapper>} />
          <Route path="/about" element={<MotionWrapper><About /></MotionWrapper>} />
          <Route path="/contact" element={<MotionWrapper><Contact /></MotionWrapper>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function MotionWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
