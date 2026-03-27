import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { productCategories } from '../data.js';

const orderedColors = ['black', 'white', 'transparent'];
const PRODUCTS_SCROLL_KEY = 'productsScroll';

function ProductCard({ product, onOpenProduct }) {
  const colorKeys = useMemo(() => Object.keys(product.colors), [product.colors]);
  const [selectedColor, setSelectedColor] = useState('black');

  useEffect(() => {
    if (!colorKeys.includes(selectedColor)) {
      setSelectedColor(colorKeys[0]);
    }
  }, [colorKeys, selectedColor]);

  const image = product.colors[selectedColor] || product.colors[colorKeys[0]];
  const slug = `${product.category.split(' ')[0].toLowerCase()}-${product.size}`;

  const colorOrder = [
    ...orderedColors.filter((c) => colorKeys.includes(c)),
    ...colorKeys.filter((c) => !orderedColors.includes(c))
  ];

  return (
    <article className="rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 bg-surface-50 dark:bg-surface-900 border border-slate-200/50 dark:border-surface-800">
      
      {/* IMAGE LINK */}
      <Link
        to={`/products/${slug}`}
        onClick={onOpenProduct}
        className="flex items-center justify-center py-6 cursor-pointer group block"
      >
        {image && (
          <img
            src={image.src}
            alt={`${product.size} ${selectedColor}`}
            className="object-contain max-h-56 transition-all duration-300 group-hover:scale-105 rounded-xl border-2 border-brand-500/50"
          />
        )}
      </Link>

      {/* CONTENT */}
      <div className="space-y-4 pt-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-accent-light dark:text-accent-light mb-1">
            {product.category}
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {product.size} Container
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-surface-200 dark:bg-surface-800 dark:text-slate-300 px-2 py-0.5 rounded">
              100% Food Grade
            </span>
          </div>
        </div>

        {/* COLOR SWITCH */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Color Variants</p>
          <div className="flex gap-3">
            {colorOrder.map((color) => {
              const active = color === selectedColor;
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                    color === 'black'
                      ? 'bg-primary border-primary'
                      : color === 'white'
                      ? 'bg-card border-border'
                      : 'bg-section border-border'
                  } ${active ? 'ring-2 ring-offset-2 ring-brand-500 ring-offset-main scale-110' : ''}`}
                />
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/products/${slug}`}
          onClick={onOpenProduct}
          className="mt-6 block w-full text-center px-5 py-3.5 rounded-xl font-bold text-[15px] bg-brand-800 text-white dark:bg-brand-600 dark:text-white dark:hover:bg-brand-500 hover:bg-brand-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg shadow-md"
          style={{ color: 'white' }}
        >
          View Product Details
        </Link>

      </div>
    </article>
  );
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const savedScroll = sessionStorage.getItem(PRODUCTS_SCROLL_KEY);
    if (!savedScroll) return;

    const scrollY = Number.parseInt(savedScroll, 10);
    if (Number.isFinite(scrollY)) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }

    sessionStorage.removeItem(PRODUCTS_SCROLL_KEY);
  }, []);

  const handleProductOpen = () => {
    sessionStorage.setItem(PRODUCTS_SCROLL_KEY, String(window.scrollY));
  };

  const allProducts = useMemo(
    () =>
      productCategories.flatMap((cat) =>
        cat.items.map((item) => ({
          ...item,
          category: cat.title
        }))
      ),
    []
  );

  const filteredProducts =
    activeFilter === 'ALL'
      ? allProducts
      : allProducts.filter((product) => product.category === activeFilter);

  return (
    <div className="px-4 bg-surface-50 dark:bg-surface-950 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* HERO */}
      <section className="mx-auto mt-4 w-full max-w-7xl rounded-2xl bg-surface-100 dark:bg-surface-900 border border-slate-200/50 dark:border-surface-800 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-light dark:text-accent-light">
          Product Catalog
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-900 dark:text-slate-100 md:text-5xl">
          Explore our container range.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-400">
          Filter by category and preview color variants with clean, minimal product display on premium styling depth.
        </p>
      </section>

      {/* FILTERS */}
      <section className="mx-auto mt-8 w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap gap-2">
          
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition border ${
              activeFilter === 'ALL'
                ? 'bg-brand-800 border-brand-800 text-white dark:bg-brand-600'
                : 'bg-surface-50 border-slate-200 dark:border-surface-800 dark:bg-surface-950 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-surface-900'
            }`}
          >
            All Products
          </button>

          {productCategories.map((category) => (
            <button
              key={category.title}
              onClick={() => setActiveFilter(category.title)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition border ${
                activeFilter === category.title
                  ? 'bg-brand-800 border-brand-800 text-white dark:bg-brand-600'
                  : 'bg-surface-50 border-slate-200 dark:border-surface-800 dark:bg-surface-950 text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-surface-900'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={`${product.category}-${product.size}`}
              product={product}
              onOpenProduct={handleProductOpen}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
