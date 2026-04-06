import { useEffect, useMemo, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import { getFallbackImage, getCategoryPlaceholder } from '../utils/mockData';

const ClothingModal = ({ item, onClose }) => {
  const { removeItem } = useWardrobe();
  const safeItem = item || {};
  const fallbackImage = useMemo(() => getFallbackImage(safeItem), [item]);
  const categoryPlaceholder = useMemo(
    () => getCategoryPlaceholder(safeItem.category),
    [item?.category]
  );
  const [imageSrc, setImageSrc] = useState(
    item?.image || fallbackImage || categoryPlaceholder
  );
  const [didFallback, setDidFallback] = useState(false);
  const [didCategoryFallback, setDidCategoryFallback] = useState(false);

  useEffect(() => {
    setImageSrc(item?.image || fallbackImage || categoryPlaceholder);
    setDidFallback(false);
    setDidCategoryFallback(false);
  }, [item?.id, item?.image, fallbackImage, categoryPlaceholder]);

  if (!item) return null;

  const categoryLabels = {
    Tops: '上装',
    Bottoms: '下装',
    Shoes: '鞋履',
    Accessories: '配饰',
  };

  const seasonLabels = {
    Spring: '春季',
    Summer: '夏季',
    Autumn: '秋季',
    Winter: '冬季',
  };

  const styleLabels = {
    Casual: '休闲',
    Formal: '正式',
    Sporty: '运动',
    Vintage: '复古',
  };

  const handleDelete = () => {
    removeItem(item.id);
    onClose();
  };

  const handleImageError = () => {
    if (!didFallback && fallbackImage && fallbackImage !== imageSrc) {
      setDidFallback(true);
      setImageSrc(fallbackImage);
      return;
    }
    if (!didCategoryFallback && categoryPlaceholder && categoryPlaceholder !== imageSrc) {
      setDidCategoryFallback(true);
      setImageSrc(categoryPlaceholder);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[430px] rounded-t-3xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={imageSrc}
            alt={item.subCategory}
            className="w-full aspect-[3/4] object-cover rounded-t-3xl"
            onError={handleImageError}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold text-slate-900">{item.subCategory}</h3>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">分类</p>
              <p className="text-sm font-medium text-slate-700">{categoryLabels[item.category]}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">颜色</p>
              <p className="text-sm font-medium text-slate-700">{item.color}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">季节</p>
              <p className="text-sm font-medium text-slate-700">{seasonLabels[item.season]}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">风格</p>
              <p className="text-sm font-medium text-slate-700">{styleLabels[item.style]}</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="w-full mt-5 h-12 bg-red-50 text-red-500 rounded-xl font-medium flex items-center justify-center gap-2 active:bg-red-100 transition-colors"
          >
            <Trash2 size={18} />
            删除衣物
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothingModal;
