import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { getFallbackImage, getCategoryPlaceholder } from '../utils/mockData';

const ClothingCard = ({ item, onClick, onDelete, wallMode = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(item.image || '');
  const [didFallback, setDidFallback] = useState(false);
  const [didCategoryFallback, setDidCategoryFallback] = useState(false);

  const fallbackImage = useMemo(() => getFallbackImage(item), [item]);
  const categoryPlaceholder = useMemo(() => getCategoryPlaceholder(item.category), [item.category]);

  useEffect(() => {
    setImageSrc(item.image || fallbackImage || categoryPlaceholder);
    setDidFallback(false);
    setDidCategoryFallback(false);
    setError(false);
    setLoaded(false);
  }, [item.image, fallbackImage, categoryPlaceholder]);

  const categoryLabels = {
    Tops: '上装',
    Bottoms: '下装',
    Shoes: '鞋履',
    Accessories: '配饰',
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item);
    }
  };

  const handleImageError = () => {
    if (!didFallback && fallbackImage && fallbackImage !== imageSrc) {
      setDidFallback(true);
      setImageSrc(fallbackImage);
      setLoaded(false);
      return;
    }

    if (!didCategoryFallback && categoryPlaceholder && categoryPlaceholder !== imageSrc) {
      setDidCategoryFallback(true);
      setImageSrc(categoryPlaceholder);
      setLoaded(false);
      return;
    }

    setError(true);
  };

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className={`group relative rounded-2xl overflow-hidden bg-slate-100/80 cursor-pointer border border-white/70 shadow-[0_12px_24px_rgba(15,23,42,0.08)] ${wallMode ? 'h-full' : ''}`}
    >
      <div className={`relative bg-slate-100 ${wallMode ? 'h-full min-h-[180px]' : 'aspect-[3/4]'}`}>
        {!loaded && !error && (
          <div className="absolute inset-0 skeleton" />
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <span className="text-slate-400 text-sm">加载失败</span>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={item.subCategory}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.08] ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-90 shadow-lg"
        >
          <Trash2 size={14} className="text-white" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-sm font-medium">{item.subCategory}</p>
          <p className="text-white/70 text-xs">{categoryLabels[item.category]}</p>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;
