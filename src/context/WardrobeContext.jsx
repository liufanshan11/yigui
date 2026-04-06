import { createContext, useContext, useState, useEffect } from 'react';
import { generateMockData, getFallbackImage, getStableImageIndex } from '../utils/mockData';

const WardrobeContext = createContext();

const STORAGE_KEY = 'smartwardrobe_items';
const OUTFITS_KEY = 'smartwardrobe_outfits';
const CURRENT_SEED_VERSION = 2;

export const WardrobeProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const shouldUpgradeLegacySeed = (rawItems = []) => {
      if (!Array.isArray(rawItems) || rawItems.length === 0) return false;
      const allNumericSeedIds = rawItems.every(
        (item) => typeof item.id === 'string' && /^item_\d+$/.test(item.id)
      );
      const hasLegacySeed = rawItems.some(
        (item) => (item.seedVersion ?? 0) < CURRENT_SEED_VERSION
      );
      return allNumericSeedIds && hasLegacySeed && rawItems.length === 47;
    };

    const normalizeItems = (rawItems = []) => {
      return rawItems.map((item) => {
        const hasValidImage = typeof item.image === 'string' && item.image.length > 0;
        const isTransientBlob = hasValidImage && item.image.startsWith('blob:');
        const isExternalUrl = hasValidImage && /^https?:\/\//.test(item.image);
        const isSvgDataUrl = hasValidImage && item.image.startsWith('data:image/svg+xml');
        const isLocalWardrobeAsset = hasValidImage && item.image.startsWith('/assets/wardrobe/');
        const isSeedItem = typeof item.id === 'string' && /^item_\d+$/.test(item.id);
        const imageIndex = isSeedItem
          ? getStableImageIndex({ ...item, imageIndex: undefined })
          : (Number.isInteger(item.imageIndex) ? item.imageIndex : getStableImageIndex(item));

        const needsSeedRebalance =
          isSeedItem &&
          (isLocalWardrobeAsset || !hasValidImage) &&
          (!Number.isInteger(item.imageIndex) || item.imageIndex !== imageIndex);

        const shouldUseFallbackImage =
          isSeedItem && (isExternalUrl || isTransientBlob || isSvgDataUrl || !hasValidImage || needsSeedRebalance);

        const image = shouldUseFallbackImage || isTransientBlob || !hasValidImage
          ? getFallbackImage({ ...item, imageIndex })
          : item.image;

        return { ...item, image, imageIndex };
      });
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const storedOutfits = localStorage.getItem(OUTFITS_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (shouldUpgradeLegacySeed(parsed)) {
          const mockData = generateMockData();
          setItems(mockData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
        } else {
          setItems(normalizeItems(parsed));
        }
      } catch (e) {
        const mockData = generateMockData();
        setItems(mockData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      }
    } else {
      const mockData = generateMockData();
      setItems(mockData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }

    if (storedOutfits) {
      try {
        setSavedOutfits(JSON.parse(storedOutfits));
      } catch (e) {
        setSavedOutfits([]);
      }
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(OUTFITS_KEY, JSON.stringify(savedOutfits));
    }
  }, [savedOutfits, isLoaded]);

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: Date.now(),
    };
    setItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemsByCategory = (category) => {
    if (!category || category === 'all') return items;
    return items.filter((item) => item.category === category);
  };

  const getCategoryCount = () => {
    return {
      Tops: items.filter((item) => item.category === 'Tops').length,
      Bottoms: items.filter((item) => item.category === 'Bottoms').length,
      Shoes: items.filter((item) => item.category === 'Shoes').length,
      Accessories: items.filter((item) => item.category === 'Accessories').length,
    };
  };

  const saveOutfit = (outfit) => {
    const newOutfit = {
      id: `outfit_${Date.now()}`,
      ...outfit,
      dateSaved: Date.now(),
    };
    setSavedOutfits((prev) => [newOutfit, ...prev]);
    return newOutfit;
  };

  const removeOutfit = (id) => {
    setSavedOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
  };

  const getSavedOutfits = () => {
    return savedOutfits;
  };

  return (
    <WardrobeContext.Provider
      value={{
        items,
        savedOutfits,
        addItem,
        removeItem,
        getItemsByCategory,
        getCategoryCount,
        saveOutfit,
        removeOutfit,
        getSavedOutfits,
        isLoaded,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
};

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};
