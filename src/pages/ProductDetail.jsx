import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { productCategories, productSpecifications } from '../data.js';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState('black');

  const allProducts = useMemo(
    () =>
      productCategories.flatMap((category) =>
        category.items.map((item) => ({
          ...item,
          category: category.title,
          slug: `${category.title.split(' ')[0].toLowerCase()}-${item.size}`
        }))
      ),
    []
  );

  const product = allProducts.find((item) => item.slug === id);

  // Scroll to top only when entering the page or switching products
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Validate the selected color against available colors for the product
  useEffect(() => {
    if (!product) return;
    const availableColors = Object.keys(product.colors);
    if (!availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0] || 'white');
    }
  }, [product, selectedColor]);
  if (!product) {
    return (
      <section className="px-4 py-12 text-center bg-surface-50 dark:bg-surface-950 min-h-screen">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Product not found
        </h1>
        <Link to="/products" className="text-accent-light dark:text-accent-light mt-4 block">
          Back to Catalog
        </Link>
      </section>
    );
  }

  const specs = productSpecifications[product.slug];

  const availableColors = Object.keys(product.colors);
  const image =
    product.colors[selectedColor]?.srcLarge ||
    product.colors[selectedColor]?.src;

  const orderedColors = ['black', 'white', 'transparent'];
  const colorOrder = [
    ...orderedColors.filter((c) => availableColors.includes(c)),
    ...availableColors.filter((c) => !orderedColors.includes(c))
  ];

  return (
    <section className="w-full h-full flex flex-col bg-surface-50 dark:bg-surface-950 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col min-h-0">

        {/* BACK */}
        <div className="shrink-0 mb-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 hover:text-accent-light dark:text-slate-400 dark:hover:text-accent-light transition-colors uppercase"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-4 flex-1 min-h-0">

          {/* LEFT SIDE */}
          <div className="flex flex-col bg-surface-50 dark:bg-surface-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/50 dark:border-surface-800 h-full relative overflow-hidden group">
            
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-900/40 text-accent-light dark:text-accent-light px-3 py-1 rounded-full shadow-sm">
                {product.category}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 min-h-0">
              {image && (
                <img
                  src={image}
                  alt={`${product.size} ${selectedColor}`}
                  className="object-contain w-full h-full max-h-[400px] drop-shadow-md transition-all duration-300 group-hover:scale-105"
                />
              )}
            </div>
            
            <div className="shrink-0 rounded-xl bg-surface-100 dark:bg-surface-950 border border-slate-200/50 dark:border-surface-800 p-4 shadow-sm text-center">
                <p className="text-[13px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                  Premium quality container designated for demanding high-volume supply chains.
                </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col bg-surface-50 dark:bg-surface-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/50 dark:border-surface-800 h-full overflow-y-auto custom-scrollbar">
            
            <div className="space-y-4 shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-extrabold tracking-widest text-accent-light dark:text-accent-light mb-1">
                    {product.category}
                  </p>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    {product.size} Container
                  </h1>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-surface-100 dark:bg-surface-950 px-2.5 py-1 rounded-md border border-slate-200 dark:border-surface-800 whitespace-nowrap">
                  MOQ: 10k+
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-light dark:text-accent-light bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">Food & FMCG</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-light dark:text-accent-light bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">Logistics</span>
              </div>
            </div>

            <div className="border-t border-slate-200/60 dark:border-surface-800 my-4 shrink-0" />

            {/* COLOR */}
            <div className="shrink-0 mb-4">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">
                Select Color Variant
              </p>
              <div className="flex gap-3">
                {colorOrder.map((color) => {
                  const active = color === selectedColor;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full border-2 transition-all duration-300 ${
                        color === 'black'
                          ? 'bg-primary border-primary'
                          : color === 'white'
                          ? 'bg-card border-border'
                          : 'bg-section border-border'
                      } ${active ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-main scale-110' : 'hover:scale-105 shadow-sm'}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* SPECS */}
            {specs && (
              <div className="flex-1 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {specs.capacity && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Capacity</p>
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{specs.capacity}</p>
                    </div>
                  )}
                  {specs.dimensions && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dimensions</p>
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{specs.dimensions}</p>
                    </div>
                  )}
                  {specs.weight && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Weight</p>
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{specs.weight}</p>
                    </div>
                  )}
                  {specs.packaging && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center gap-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Packaging</p>
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">{specs.packaging}</p>
                    </div>
                  )}
                  {specs.colors && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 sm:col-span-2 flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Available Colors</p>
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{specs.colors}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
}
