import { useWardrobe } from '../context/WardrobeContext';

const StatCard = () => {
  const { getCategoryCount } = useWardrobe();
  const counts = getCategoryCount();

  const stats = [
    { label: '上装', value: counts.Tops, color: '#0f172a', bgLight: '#f1f5f9', key: 'Tops' },
    { label: '下装', value: counts.Bottoms, color: '#0f766e', bgLight: '#ecfeff', key: 'Bottoms' },
    { label: '鞋履', value: counts.Shoes, color: '#ea580c', bgLight: '#fff7ed', key: 'Shoes' },
  ];

  const total = stats.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="premium-card p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-slate-900">衣物统计面板</h3>
        <span className="text-xs text-slate-500 font-semibold">共 {total} 件</span>
      </div>
      
      <div className="flex items-center justify-around">
        {stats.map((stat) => (
          <div key={stat.key} className="flex flex-col items-center">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center border border-white/80"
              style={{ backgroundColor: stat.bgLight }}
            >
              <span 
                className="text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-3 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-slate-100">
        <div className="flex gap-1.5">
          {stats.map((stat, idx) => (
            <div
              key={stat.key}
              className="h-1.5 rounded-full"
              style={{ 
                flex: stat.value,
                backgroundColor: stat.color,
                opacity: 0.9,
                borderRadius: idx === stats.length - 1 ? '6px' : '6px 0 0 6px',
                minWidth: '16px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
