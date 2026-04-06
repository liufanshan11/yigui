import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import { getFallbackImage } from '../utils/mockData';
import CinematicHeader from '../components/CinematicHeader';
import ClothingCard from '../components/ClothingCard';
import ClothingModal from '../components/ClothingModal';
import Toast from '../components/Toast';

const filters = [
  { key: 'all', label: '全部' },
  { key: 'Tops', label: '上装' },
  { key: 'Bottoms', label: '下装' },
  { key: 'Shoes', label: '鞋履' },
  { key: 'Accessories', label: '配饰' },
];

const categoryLabels = {
  Tops: '上装',
  Bottoms: '下装',
  Shoes: '鞋履',
  Accessories: '配饰',
};

const Wardrobe = () => {
  const { getItemsByCategory, removeItem } = useWardrobe();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);

  const items = getItemsByCategory(activeFilter);
  const featuredItems = items.slice(0, 4);

  const mosaicItems = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      mosaicClass:
        index % 12 === 0
          ? 'md:col-span-3 md:row-span-2'
          : index % 8 === 0
            ? 'md:col-span-2 md:row-span-2'
            : index % 5 === 0
              ? 'md:col-span-2'
              : 'md:col-span-1',
    }));
  }, [items]);

  const handleDelete = (item) => {
    removeItem(item.id);
    setToast({ message: '已删除', type: 'success' });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="max-w-[1450px] mx-auto px-6 lg:px-10 pt-10 pb-8">
        <CinematicHeader
          eyebrow="智能衣橱矩阵"
          title="我的衣橱"
          description="以策展视角管理单品，快速发现搭配关系，形成可复用的个人风格资产。"
          image="https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=1600&h=700&fit=crop&auto=format"
        />

        <div className="neo-filter-shell mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">风格筛选器</h2>
            <p className="text-white/55 text-sm mt-1">当前共 {items.length} 件单品</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`neo-filter-chip ${activeFilter === filter.key ? 'active' : ''}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="neo-empty-state">
            <div className="text-5xl">🧥</div>
            <p className="text-white text-xl mt-4">还没有单品</p>
            <p className="text-white/60 mt-2">去上传你的第一件服饰，开始构建风格库</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <section className="xl:col-span-3 space-y-4">
              <div className="neo-side-panel">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={15} className="text-lime-300" />
                  <p className="text-sm tracking-[0.14em] text-white/70">今日推荐单品</p>
                </div>
                <div className="space-y-3">
                  {featuredItems.map((item, index) => (
                    <button
                      key={`featured-${item.id}`}
                      onClick={() => setSelectedItem(item)}
                      className={`neo-feature-card ${index % 2 === 0 ? 'tilt-left' : 'tilt-right'}`}
                    >
                      <img
                        src={item.image}
                        alt={item.subCategory}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackImage(item);
                        }}
                      />
                      <div className="overlay" />
                      <div className="content">
                        <p>{categoryLabels[item.category] || item.category}</p>
                        <h4>{item.subCategory}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="xl:col-span-9">
              <div className="neo-mosaic-grid">
                {mosaicItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`animate-fade-in ${item.mosaicClass}`}
                    style={{ animationDelay: `${Math.min(index * 24, 260)}ms` }}
                  >
                    <ClothingCard
                      item={item}
                      onClick={setSelectedItem}
                      onDelete={handleDelete}
                      wallMode
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {selectedItem && <ClothingModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Wardrobe;
