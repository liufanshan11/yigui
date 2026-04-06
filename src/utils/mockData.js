export const CATEGORIES = ['Tops', 'Bottoms', 'Shoes', 'Accessories'];

export const SUB_CATEGORIES = {
  Tops: ['T-shirt', 'Shirt', 'Hoodie', 'Sweater', 'Tank Top', 'Blouse', 'Jacket', 'Coat'],
  Bottoms: ['Jeans', 'Trousers', 'Shorts', 'Skirt', 'Leggings'],
  Shoes: ['Sneakers', 'Loafers', 'Boots', 'Sandals', 'Heels'],
  Accessories: ['Watch', 'Sunglasses', 'Hat', 'Scarf', 'Belt', 'Bag']
};

export const COLORS = ['White', 'Black', 'Navy', 'Beige', 'Gray', 'Blue', 'Green', 'Pink', 'Brown', 'Silver', 'Charcoal', 'Cream', 'Light Blue'];

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

export const STYLES = ['Casual', 'Formal', 'Sporty', 'Vintage'];

const createCategoryPlaceholder = (title, toneA, toneB) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${toneA}" />
          <stop offset="100%" stop-color="${toneB}" />
        </linearGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#bg)"/>
      <rect x="48" y="48" width="804" height="1104" rx="34" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
      <text x="78" y="1030" fill="#f8fafc" font-family="Arial, sans-serif" font-size="74" font-weight="700">${title}</text>
      <text x="78" y="1082" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28">智慧衣橱</text>
    </svg>
  `)}`;

const CATEGORY_PLACEHOLDER = {
  Tops: createCategoryPlaceholder('上装', '#1f2937', '#111827'),
  Bottoms: createCategoryPlaceholder('下装', '#1e293b', '#0f172a'),
  Shoes: createCategoryPlaceholder('鞋履', '#334155', '#0f172a'),
  Accessories: createCategoryPlaceholder('配饰', '#0f172a', '#020617'),
};

export const getCategoryPlaceholder = (category = 'Tops') =>
  CATEGORY_PLACEHOLDER[category] || CATEGORY_PLACEHOLDER.Tops;

const positiveMod = (value, base) => {
  if (!base) return 0;
  return ((value % base) + base) % base;
};

const hashString = (input = '') => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getItemSeed = (item = {}) =>
  `${item.id || ''}|${item.category || ''}|${item.subCategory || ''}|${item.color || ''}|${item.style || ''}|${item.dateAdded || ''}`;

const CATEGORY_META = {
  Tops: { label: '上装', toneA: '#111827', toneB: '#1f2937' },
  Bottoms: { label: '下装', toneA: '#0f172a', toneB: '#1e293b' },
  Shoes: { label: '鞋履', toneA: '#0b1220', toneB: '#273449' },
  Accessories: { label: '配饰', toneA: '#111827', toneB: '#1f2937' },
};

const STYLE_ACCENT = {
  Casual: '#22d3ee',
  Formal: '#f8fafc',
  Sporty: '#34d399',
  Vintage: '#f59e0b',
};

const escapeXml = (text = '') =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const getGeneratedItemImage = (item = {}) => {
  const category = item.category || 'Tops';
  const meta = CATEGORY_META[category] || CATEGORY_META.Tops;
  const title = escapeXml(item.subCategory || meta.label);
  const subtitle = escapeXml(`${item.color || ''} · ${item.style || ''}`);
  const accent = STYLE_ACCENT[item.style] || '#22d3ee';

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${meta.toneA}" />
          <stop offset="100%" stop-color="${meta.toneB}" />
        </linearGradient>
        <radialGradient id="glow" cx="70%" cy="28%" r="55%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.7" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#bg)"/>
      <rect width="900" height="1200" fill="url(#glow)"/>
      <rect x="44" y="44" width="812" height="1112" rx="30" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>
      <circle cx="760" cy="175" r="22" fill="${accent}" opacity="0.92"/>
      <text x="80" y="1040" fill="#f8fafc" font-family="Arial, sans-serif" font-size="68" font-weight="700">${title}</text>
      <text x="80" y="1098" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28">${subtitle}</text>
      <text x="80" y="132" fill="rgba(255,255,255,0.75)" font-family="Arial, sans-serif" font-size="28">${meta.label}</text>
    </svg>
  `)}`;
};

export const MOCK_IMAGES = {
  Tops: [
    '/assets/wardrobe/tops-1.jpg',
    '/assets/wardrobe/tops-2.jpg',
    '/assets/wardrobe/tops-3.jpg',
    '/assets/wardrobe/tops-4.jpg',
    '/assets/wardrobe/tops-5.jpg',
    '/assets/wardrobe/tops-6.jpg',
    '/assets/wardrobe/tops-7.jpg',
  ],
  Bottoms: [
    '/assets/wardrobe/bottoms-1.jpg',
    '/assets/wardrobe/bottoms-2.jpg',
    '/assets/wardrobe/bottoms-3.jpg',
    '/assets/wardrobe/bottoms-4.jpg',
    '/assets/wardrobe/bottoms-5.jpg',
    '/assets/wardrobe/bottoms-6.jpg',
    '/assets/wardrobe/bottoms-7.jpg',
  ],
  Shoes: [
    '/assets/wardrobe/shoes-1.jpg',
    '/assets/wardrobe/shoes-2.jpg',
    '/assets/wardrobe/shoes-3.jpg',
    '/assets/wardrobe/shoes-4.jpg',
    '/assets/wardrobe/shoes-5.jpg',
    '/assets/wardrobe/shoes-6.jpg',
    '/assets/wardrobe/shoes-7.jpg',
  ],
  Accessories: [
    '/assets/wardrobe/accessories-1.jpg',
    '/assets/wardrobe/accessories-2.jpg',
    '/assets/wardrobe/accessories-3.jpg',
    '/assets/wardrobe/accessories-4.jpg',
    '/assets/wardrobe/accessories-5.jpg',
    '/assets/wardrobe/accessories-6.jpg',
    '/assets/wardrobe/accessories-7.jpg',
  ]
};

const BOTTOM_SUBCATEGORY_IMAGE_INDEX = {
  Jeans: [0, 3],
  Trousers: [1, 6],
  Shorts: [2, 5],
  Skirt: [4, 0],
  Leggings: [5, 2],
};

export const getStableImageIndex = (item = {}) => {
  const category = item.category || 'Tops';
  const categoryImages = MOCK_IMAGES[category] || [];
  const len = categoryImages.length;
  if (!len) return 0;

  if (Number.isInteger(item.imageIndex)) {
    return positiveMod(item.imageIndex, len);
  }

  if (category === 'Bottoms') {
    const candidates = BOTTOM_SUBCATEGORY_IMAGE_INDEX[item.subCategory];
    if (Array.isArray(candidates) && candidates.length) {
      const pick = hashString(getItemSeed(item));
      return candidates[positiveMod(pick, candidates.length)];
    }
  }

  return positiveMod(hashString(getItemSeed(item)), len);
};

export const getFallbackImage = (item = {}) => {
  const category = item.category || 'Tops';
  const categoryImages = MOCK_IMAGES[category] || [];
  const stableIndex = getStableImageIndex(item);
  if (categoryImages[stableIndex]) return categoryImages[stableIndex];
  if (categoryImages[0]) return categoryImages[0];

  return getGeneratedItemImage(item) || getCategoryPlaceholder(category);
};

export const generateMockData = () => {
  const items = [];
  let id = 1;

  const mockItems = [
    { category: 'Tops', subCategory: 'T-shirt', color: 'White', season: 'Summer', style: 'Casual', imageIndex: 0 },
    { category: 'Tops', subCategory: 'T-shirt', color: 'Black', season: 'Summer', style: 'Casual', imageIndex: 1 },
    { category: 'Tops', subCategory: 'T-shirt', color: 'Charcoal', season: 'Summer', style: 'Casual', imageIndex: 6 },
    { category: 'Tops', subCategory: 'T-shirt', color: 'Green', season: 'Summer', style: 'Casual', imageIndex: 6 },
    { category: 'Tops', subCategory: 'Hoodie', color: 'Gray', season: 'Autumn', style: 'Sporty', imageIndex: 3 },
    { category: 'Tops', subCategory: 'Hoodie', color: 'Black', season: 'Autumn', style: 'Sporty', imageIndex: 3 },
    { category: 'Tops', subCategory: 'Hoodie', color: 'Navy', season: 'Winter', style: 'Sporty', imageIndex: 3 },
    { category: 'Tops', subCategory: 'Shirt', color: 'Light Blue', season: 'Spring', style: 'Casual', imageIndex: 2 },
    { category: 'Tops', subCategory: 'Shirt', color: 'White', season: 'Spring', style: 'Formal', imageIndex: 2 },
    { category: 'Tops', subCategory: 'Jacket', color: 'Black', season: 'Autumn', style: 'Casual', imageIndex: 4 },
    { category: 'Tops', subCategory: 'Jacket', color: 'Navy', season: 'Autumn', style: 'Casual', imageIndex: 4 },
    { category: 'Tops', subCategory: 'Sweater', color: 'Cream', season: 'Winter', style: 'Casual', imageIndex: 3 },
    { category: 'Tops', subCategory: 'Sweater', color: 'Gray', season: 'Winter', style: 'Casual', imageIndex: 3 },
    { category: 'Tops', subCategory: 'Tank Top', color: 'Black', season: 'Summer', style: 'Sporty', imageIndex: 0 },
    { category: 'Tops', subCategory: 'Blouse', color: 'Cream', season: 'Spring', style: 'Casual', imageIndex: 5 },
    { category: 'Tops', subCategory: 'Coat', color: 'Gray', season: 'Winter', style: 'Formal', imageIndex: 4 },

    { category: 'Bottoms', subCategory: 'Jeans', color: 'Light Blue', season: 'Spring', style: 'Casual', imageIndex: 0 },
    { category: 'Bottoms', subCategory: 'Jeans', color: 'Black', season: 'Spring', style: 'Casual', imageIndex: 1 },
    { category: 'Bottoms', subCategory: 'Jeans', color: 'Gray', season: 'Autumn', style: 'Casual', imageIndex: 0 },
    { category: 'Bottoms', subCategory: 'Trousers', color: 'Charcoal', season: 'Spring', style: 'Casual', imageIndex: 1 },
    { category: 'Bottoms', subCategory: 'Trousers', color: 'Beige', season: 'Autumn', style: 'Casual', imageIndex: 1 },
    { category: 'Bottoms', subCategory: 'Trousers', color: 'Black', season: 'Autumn', style: 'Formal', imageIndex: 1 },
    { category: 'Bottoms', subCategory: 'Shorts', color: 'Black', season: 'Summer', style: 'Casual', imageIndex: 2 },
    { category: 'Bottoms', subCategory: 'Shorts', color: 'Navy', season: 'Summer', style: 'Sporty', imageIndex: 2 },
    { category: 'Bottoms', subCategory: 'Skirt', color: 'Black', season: 'Summer', style: 'Casual', imageIndex: 0 },
    { category: 'Bottoms', subCategory: 'Skirt', color: 'Blue', season: 'Summer', style: 'Casual', imageIndex: 0 },
    { category: 'Bottoms', subCategory: 'Leggings', color: 'Black', season: 'Winter', style: 'Sporty', imageIndex: 2 },
    { category: 'Bottoms', subCategory: 'Leggings', color: 'Gray', season: 'Autumn', style: 'Sporty', imageIndex: 2 },

    { category: 'Shoes', subCategory: 'Sneakers', color: 'White', season: 'Spring', style: 'Sporty', imageIndex: 0 },
    { category: 'Shoes', subCategory: 'Sneakers', color: 'Black', season: 'Spring', style: 'Casual', imageIndex: 1 },
    { category: 'Shoes', subCategory: 'Sneakers', color: 'Silver', season: 'Spring', style: 'Casual', imageIndex: 6 },
    { category: 'Shoes', subCategory: 'Sneakers', color: 'Blue', season: 'Summer', style: 'Sporty', imageIndex: 1 },
    { category: 'Shoes', subCategory: 'Loafers', color: 'Black', season: 'Spring', style: 'Formal', imageIndex: 2 },
    { category: 'Shoes', subCategory: 'Loafers', color: 'Brown', season: 'Spring', style: 'Formal', imageIndex: 2 },
    { category: 'Shoes', subCategory: 'Boots', color: 'Black', season: 'Winter', style: 'Casual', imageIndex: 3 },
    { category: 'Shoes', subCategory: 'Sandals', color: 'Beige', season: 'Summer', style: 'Casual', imageIndex: 4 },
    { category: 'Shoes', subCategory: 'Heels', color: 'Black', season: 'Summer', style: 'Formal', imageIndex: 5 },

    { category: 'Accessories', subCategory: 'Bag', color: 'Black', season: 'Spring', style: 'Casual', imageIndex: 3 },
    { category: 'Accessories', subCategory: 'Bag', color: 'White', season: 'Summer', style: 'Casual', imageIndex: 3 },
    { category: 'Accessories', subCategory: 'Bag', color: 'Silver', season: 'Autumn', style: 'Casual', imageIndex: 3 },
    { category: 'Accessories', subCategory: 'Hat', color: 'Navy', season: 'Autumn', style: 'Casual', imageIndex: 2 },
    { category: 'Accessories', subCategory: 'Hat', color: 'Black', season: 'Autumn', style: 'Casual', imageIndex: 2 },
    { category: 'Accessories', subCategory: 'Sunglasses', color: 'Black', season: 'Summer', style: 'Casual', imageIndex: 1 },
    { category: 'Accessories', subCategory: 'Watch', color: 'Silver', season: 'Spring', style: 'Formal', imageIndex: 0 },
    { category: 'Accessories', subCategory: 'Watch', color: 'Black', season: 'Spring', style: 'Casual', imageIndex: 0 },
    { category: 'Accessories', subCategory: 'Belt', color: 'Black', season: 'Spring', style: 'Formal', imageIndex: 5 },
    { category: 'Accessories', subCategory: 'Scarf', color: 'Gray', season: 'Winter', style: 'Casual', imageIndex: 4 },
  ];

  mockItems.forEach((item) => {
    const currentId = id++;
    const resolvedImageIndex = getStableImageIndex({ ...item, id: `item_${currentId}` });
    const imageList = MOCK_IMAGES[item.category] || [];
    const image = imageList[resolvedImageIndex % imageList.length] || getFallbackImage(item);
    
    items.push({
      id: `item_${currentId}`,
      image: image,
      category: item.category,
      subCategory: item.subCategory,
      imageIndex: resolvedImageIndex,
      color: item.color,
      season: item.season,
      style: item.style,
      seedVersion: 2,
      dateAdded: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    });
  });

  return items;
};
