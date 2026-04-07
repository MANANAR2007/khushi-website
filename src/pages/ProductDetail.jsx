import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productCategories, productSpecifications } from '../data.js';

const colorSwatchValues = {
  black: '#111827',
  white: '#ffffff',
  transparent: '#D1D5DB'
};

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
      <section className="min-h-full py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-950">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Product not found
          </h1>
          <Link to="/products" className="text-accent-light dark:text-accent-light mt-4 block text-center">
            Back to Catalog
          </Link>
        </div>
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
    <section className="min-h-full py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-950">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-slate-500 hover:text-accent-light dark:text-slate-400 dark:hover:text-accent-light transition-colors uppercase"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full flex flex-col bg-surface-50 dark:bg-surface-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-surface-800 group">
              <div className="mb-6 text-left">
                <span className="inline-flex text-[11px] font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-900/40 text-accent-light dark:text-accent-light px-3 py-1 rounded-full shadow-sm break-words">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center justify-center p-2 sm:p-4">
                {image && (
                  <img
                    src={image}
                    alt={`${product.size} ${selectedColor}`}
                    className="w-full max-h-[250px] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[420px] object-contain mx-auto drop-shadow-md transition-all duration-300 group-hover:scale-105"
                  />
                )}
              </div>
            
              <div className="rounded-xl bg-surface-100 dark:bg-surface-950 border border-slate-200/50 dark:border-surface-800 p-4 shadow-sm text-left">
                <p className="text-[13px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                  Premium quality container designated for demanding high-volume supply chains.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-4 break-words bg-surface-50 dark:bg-surface-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-surface-800">
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div className="break-words">
                  <p className="text-[11px] uppercase font-extrabold tracking-widest text-accent-light dark:text-accent-light mb-1">
                    {product.category}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 break-words">
                    {product.size} Container
                  </h1>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-surface-100 dark:bg-surface-950 px-2.5 py-1 rounded-md border border-slate-200 dark:border-surface-800">
                  MOQ: 10k+
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-light dark:text-accent-light bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">Food & FMCG</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent-light dark:text-accent-light bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">Logistics</span>
              </div>
            </div>

            <div className="border-t border-slate-200/60 dark:border-surface-800" />

            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">
                Select Color Variant
              </p>
              <div className="flex flex-wrap gap-2">
                {colorOrder.map((color) => {
                  const active = color === selectedColor;
                  const swatchColor = colorSwatchValues[color] || '#9CA3AF';
                  const isLightSwatch = color === 'white' || color === 'transparent';
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      aria-label={`Select ${color} color`}
                      className={`h-11 w-11 rounded-full border-2 transition-all duration-300 ${
                        isLightSwatch ? 'border-slate-400/80' : 'border-slate-700/80'
                      } ${active ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-main scale-110' : 'hover:scale-105 shadow-sm'}`}
                      style={{ backgroundColor: swatchColor }}
                    />
                  );
                })}
              </div>
            </div>

            {specs && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specs.capacity && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center break-words">
                      <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Capacity</p>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 break-words">{specs.capacity}</p>
                    </div>
                  )}
                  {specs.dimensions && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center break-words">
                      <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Dimensions</p>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 break-words">{specs.dimensions}</p>
                    </div>
                  )}
                  {specs.weight && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center break-words">
                      <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Weight</p>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 break-words">{specs.weight}</p>
                    </div>
                  )}
                  {specs.packaging && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 flex flex-col justify-center gap-1 break-words">
                      <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Packaging</p>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight break-words">{specs.packaging}</p>
                    </div>
                  )}
                  {specs.colors && (
                    <div className="bg-surface-100 dark:bg-surface-950 rounded-xl p-3 border border-slate-200/50 dark:border-surface-800 sm:col-span-2 flex flex-col justify-center break-words">
                      <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Available Colors</p>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 break-words">{specs.colors}</p>
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
