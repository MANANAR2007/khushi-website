const baseUrl = import.meta.env.BASE_URL || '/';
const asset = (path) => `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
const productImage = (path) => {
  const url = asset(path);
  const extless = url.replace(/\.[^.]+$/, '');
  const src400 = `${extless}-400.jpg`;
  const src800 = `${extless}-800.jpg`;
  return {
    src: src400,
    srcLarge: src800,
    srcSet: `${src400} 400w, ${src800} 800w`,
    sizes: '(max-width: 768px) 70vw, 300px'
  };
};

export const productCategories = [
  {
    title: 'ROUND CONTAINERS',
    items: [
      {
        size: '100ml',
        colors: {
          white: productImage('assets/containers/round/100ml_white.jpg'),
          black: productImage('assets/containers/round/100ml_black.jpg'),
          transparent: productImage('assets/containers/round/100ml_transparent.jpg')
        }
      },
      {
        size: '200ml',
        colors: {
          white: productImage('assets/containers/round/200ml_white.jpg'),
          black: productImage('assets/containers/round/200ml_black.jpg')
        }
      },
      {
        size: '250ml',
        colors: {
          white: productImage('assets/containers/round/250ml_white.jpg'),
          black: productImage('assets/containers/round/250ml_black.jpg'),
          transparent: productImage('assets/containers/round/250ml_transparent.jpg')
        }
      },
      {
        size: '300ml',
        colors: {
          white: productImage('assets/containers/round/300ml_white.jpg'),
          black: productImage('assets/containers/round/300ml_black.jpg'),
          transparent: productImage('assets/containers/round/300ml_transparent.jpg')
        }
      },
      {
        size: '500g',
        colors: {
          white: productImage('assets/containers/round/500g_white.jpg'),
          black: productImage('assets/containers/round/500g_black.jpg'),
          transparent: productImage('assets/containers/round/500g_transparent.jpg')
        }
      },
      {
        size: '500ml',
        colors: {
          white: productImage('assets/containers/round/500ml_white.jpg'),
          black: productImage('assets/containers/round/500ml_black.jpg'),
          transparent: productImage('assets/containers/round/500ml_transparent.jpg')
        }
      },
      {
        size: '600ml',
        colors: {
          white: productImage('assets/containers/round/600ml_white.jpg'),
          black: productImage('assets/containers/round/600ml_black.jpg'),
          transparent: productImage('assets/containers/round/600ml_transparent.jpg')
        }
      },
      {
        size: '750ml',
        colors: {
          white: productImage('assets/containers/round/750ml_white.jpg'),
          black: productImage('assets/containers/round/750ml_black.jpg'),
          transparent: productImage('assets/containers/round/750ml_transparent.jpg')
        }
      },
      {
        size: '1000ml',
        colors: {
          white: productImage('assets/containers/round/1000ml_white.jpg'),
          black: productImage('assets/containers/round/1000ml_black.jpg'),
          transparent: productImage('assets/containers/round/1000ml_transparent.jpg')
        }
      },
      {
        size: '2500ml',
        colors: {
          white: productImage('assets/containers/round/2500ml_white.jpg'),
          black: productImage('assets/containers/round/2500ml_black.jpg')
        }
      }
    ]
  },
  {
    title: 'RECTANGLE CONTAINERS',
    items: [
      {
        size: '500ml',
        colors: {
          white: productImage('assets/containers/rectangle/500ml_rect_white.jpg'),
          black: productImage('assets/containers/rectangle/500ml_rect_black.jpg'),
          transparent: productImage('assets/containers/rectangle/500ml_rect_transparent.jpg')
        }
      },
      {
        size: '750ml',
        colors: {
          white: productImage('assets/containers/rectangle/750ml_rect_white.jpg'),
          black: productImage('assets/containers/rectangle/750ml_rect_black.jpg'),
          transparent: productImage('assets/containers/rectangle/750ml_rect_transparent.jpg')
        }
      },
      {
        size: '1000ml',
        colors: {
          white: productImage('assets/containers/rectangle/1000ml_rect_white.jpg'),
          black: productImage('assets/containers/rectangle/1000ml_rect_black.jpg'),
          transparent: productImage('assets/containers/rectangle/1000ml_rect_transparent.jpg')
        }
      }
    ]
  },
  {
    title: 'BOWL CONTAINERS',
    items: [
      {
        size: '650ml',
        colors: {
          black: productImage('assets/containers/bowl/650ml_bowl_black.jpg')
        }
      }
    ]
  }
];

export const productSpecifications = {
  'round-100ml': {
    capacity: '100 ML',
    dimensions: 'Ø 78 x 40 mm',
    weight: '7.0 grams',
    packaging: '2500 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-200ml': {
    capacity: '200 ML',
    dimensions: 'Ø 99 x 38 mm',
    weight: '9.8 grams',
    packaging: '1500 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-250ml': {
    capacity: '250 ML',
    dimensions: 'Ø 111 x 42 mm',
    weight: '13.2 grams',
    packaging: '1000 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-300ml': {
    capacity: '300 ML',
    dimensions: 'Ø 124 x 43 mm',
    weight: '16.0 grams',
    packaging: '1000 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-500g': {
    capacity: '500 Grams',
    dimensions: 'Ø 111 x 65 mm',
    weight: '16.0 grams',
    packaging: '1000 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-500ml': {
    capacity: '500 ML',
    dimensions: 'Ø 111 x 81 mm',
    weight: '17. grams',
    packaging: '1000 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-600ml': {
    capacity: '600 ML FLAT',
    dimensions: 'Ø 150 x 46 mm',
    weight: '23.8 grams',
    packaging: '600 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-750ml': {
    capacity: '750 ML TALL',
    dimensions: 'Ø 111 x 120 mm',
    weight: '23.8 grams',
    packaging: '1000 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-750ml-flat': {
    capacity: '750 ML FLAT',
    dimensions: 'Ø 150 x 55 mm',
    weight: '24.8 grams',
    packaging: '600 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-1000ml': {
    capacity: '1000 ML',
    dimensions: 'Ø 150 x 85 mm',
    weight: '30.3 grams',
    packaging: '1000 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'round-2500ml': {
    capacity: '2500 ML',
    dimensions: 'Ø 172 x 152 mm',
    weight: '60 grams',
    packaging: '300 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'bowl-650ml': {
    capacity: 'RICE BOWL 650 ML',
    dimensions: 'Ø 150 x 64 mm',
    weight: '22.2 grams',
    packaging: '600 pcs / box',
    colors: 'Black, White, Transparent'
  },
  'rectangle-500ml': {
    capacity: '500 ML',
    dimensions: '175 x 121 x 37 mm',
    weight: '25.2 grams',
    packaging: '750 pcs / box',
    colors: 'Black, White'
  },
  'rectangle-650ml': {
    capacity: '650 ML',
    dimensions: '175 x 121 x 46 mm',
    weight: '26.5 grams',
    packaging: '750 pcs / box',
    colors: 'Black, White'
  },
  'rectangle-750ml': {
    capacity: '750 ML',
    dimensions: '175 x 121 x 55 mm',
    weight: '28.5 grams',
    packaging: '750 pcs / box',
    colors: 'Black, White'
  },
  'rectangle-1000ml': {
    capacity: '1000 ML',
    dimensions: '175 x 121 x 69 mm',
    weight: '30 grams',
    packaging: '750 pcs / box',
    colors: 'Black, White'
  }
};

export const stats = [
  { value: '80', label: 'Metric Tonnes/Month' },
  { value: '0.38', label: 'mm Wall Thickness' },
  { value: '~5', label: 'Second Cycle Time' },
  { value: '7', label: 'Toshiba Machines' }
];

export const features = [
  '100% Food-Grade',
  'BPA-Free',
  'Hygienic & Leak-Proof',
  'Microwave Safe (100°C)',
  'Freezer Safe'
];

export const values = [
  { icon: '⏱', label: 'Timely Delivery' },
  { icon: '🤝', label: 'Ethical Practices' },
  { icon: '👥', label: 'Customer-Centric' },
  { icon: '🚚', label: 'Efficient Logistics' }
];

export const industries = [
  {
    title: 'Restaurants & Cloud Kitchens',
    desc: 'Leak-proof delivery containers that keep food fresh and hot during transit.',
    icon: '🛵'
  },
  {
    title: 'FMCG & Retail',
    desc: 'High-clarity round and rectangle tubs designed for shelf-appeal and stacking.',
    icon: '🏪'
  },
  {
    title: 'Sweets & Confectionery',
    desc: 'Premium glossy finished containers that perfectly showcase delicate desserts.',
    icon: '🧁'
  },
  {
    title: 'Food Buckets',
    desc: 'Highly durable bowls and containers for large-scale serving.',
    icon: '🎯'
  }
];

export const comparison = [
  {
    feature: 'Material Quality',
    us: '100% Virgin Food-Grade PP',
    them: 'Mixed / Recycled Plastic'
  },
  {
    feature: 'Durability',
    us: '0.38mm Heavy-Duty Wall',
    them: 'Flimsy, easily cracks'
  },
  {
    feature: 'Seal Experience',
    us: 'Snap-tight, 100% Leak Proof',
    them: 'Loose fitting, liquid spills'
  },
  {
    feature: 'Recyclability',
    us: 'Fully recyclable (Category 5)',
    them: 'Often non-recyclable blends'
  }
];
