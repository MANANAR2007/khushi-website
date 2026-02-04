const baseUrl = import.meta.env.BASE_URL || '/';
const asset = (path) => `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;

export const productCategories = [
  {
    title: 'ROUND CONTAINERS',
    items: [
      {
        size: '100ml',
        colors: {
          white: asset('assets/containers/round/100ml_white.jpg'),
          black: asset('assets/containers/round/100ml_black.jpg'),
          transparent: asset('assets/containers/round/100ml_transparent.jpg')
        }
      },
      {
        size: '200ml',
        colors: {
          white: asset('assets/containers/round/200ml_white.jpg'),
          black: asset('assets/containers/round/200ml_black.jpg')
        }
      },
      {
        size: '250ml',
        colors: {
          white: asset('assets/containers/round/250ml_white.jpg'),
          black: asset('assets/containers/round/250ml_black.jpg'),
          transparent: asset('assets/containers/round/250ml_transparent.jpg')
        }
      },
      {
        size: '300ml',
        colors: {
          white: asset('assets/containers/round/300ml_white.jpg'),
          black: asset('assets/containers/round/300ml_black.jpg'),
          transparent: asset('assets/containers/round/300ml_transparent.jpg')
        }
      },
      {
        size: '500g',
        colors: {
          white: asset('assets/containers/round/500g_white.jpg'),
          black: asset('assets/containers/round/500g_black.jpg'),
          transparent: asset('assets/containers/round/500g_transparent.jpg')
        }
      },
      {
        size: '500ml',
        colors: {
          white: asset('assets/containers/round/500ml_white.jpg'),
          black: asset('assets/containers/round/500ml_black.jpg'),
          transparent: asset('assets/containers/round/500ml_transparent.jpg')
        }
      },
      {
        size: '600ml',
        colors: {
          white: asset('assets/containers/round/600ml_white.jpg'),
          black: asset('assets/containers/round/600ml_black.jpg'),
          transparent: asset('assets/containers/round/600ml_transparent.jpg')
        }
      },
      {
        size: '750ml',
        colors: {
          white: asset('assets/containers/round/750ml_white.jpg'),
          black: asset('assets/containers/round/750ml_black.jpg'),
          transparent: asset('assets/containers/round/750ml_transparent.jpg')
        }
      },
      {
        size: '1000ml',
        colors: {
          white: asset('assets/containers/round/1000ml_white.jpg'),
          black: asset('assets/containers/round/1000ml_black.jpg'),
          transparent: asset('assets/containers/round/1000ml_transparent.jpg')
        }
      },
      {
        size: '2500ml',
        colors: {
          white: asset('assets/containers/round/2500ml_white.jpg'),
          black: asset('assets/containers/round/2500ml_black.jpg')
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
          white: asset('assets/containers/rectangle/500ml_rect_white.jpg'),
          black: asset('assets/containers/rectangle/500ml_rect_black.jpg'),
          transparent: asset('assets/containers/rectangle/500ml_rect_transparent.jpg')
        }
      },
      {
        size: '750ml',
        colors: {
          white: asset('assets/containers/rectangle/750ml_rect_white.jpg'),
          black: asset('assets/containers/rectangle/750ml_rect_black.jpg'),
          transparent: asset('assets/containers/rectangle/750ml_rect_transparent.jpg')
        }
      },
      {
        size: '1000ml',
        colors: {
          white: asset('assets/containers/rectangle/1000ml_rect_white.jpg'),
          black: asset('assets/containers/rectangle/1000ml_rect_black.jpg'),
          transparent: asset('assets/containers/rectangle/1000ml_rect_transparent.jpg')
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
          black: asset('assets/containers/bowl/650ml_bowl_black.jpg')
        }
      }
    ]
  }
];

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
