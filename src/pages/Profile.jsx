import { Activity, AlertTriangle, CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import { analyzeWardrobe } from '../utils/aiLogic';
import CinematicHeader from '../components/CinematicHeader';

const Profile = () => {
  const { items, getCategoryCount } = useWardrobe();
  const analysis = analyzeWardrobe(items);
  const counts = getCategoryCount();

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-8">
        <CinematicHeader
          eyebrow="Insight Engine"
          title="衣橱诊断"
          description="从单品覆盖率、风格平衡和季节适配三个维度，量化你的衣橱健康状态。"
          image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=700&fit=crop&auto=format"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="premium-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold text-slate-900">衣橱健康分</h3>
              <Activity size={24} className="text-slate-400" />
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#f5f5f5"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={getScoreColor(analysis?.score || 0)}
                    strokeWidth="8"
                    strokeDasharray={`${(analysis?.score || 0) * 2.76}, 276`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span 
                    className="text-6xl font-bold"
                    style={{ color: getScoreColor(analysis?.score || 0) }}
                  >
                    {analysis?.score || 0}
                  </span>
                  <span className="text-sm text-slate-400 mt-1">分</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
              {[
                { label: '上装', value: counts.Tops, color: 'bg-slate-900' },
                { label: '下装', value: counts.Bottoms, color: 'bg-indigo-500' },
                { label: '鞋履', value: counts.Shoes, color: 'bg-emerald-500' },
                { label: '配饰', value: counts.Accessories, color: 'bg-amber-500' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`w-8 h-8 ${stat.color} rounded-xl mx-auto mb-3`} />
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {analysis && analysis.issues.length > 0 && (
              <div className="premium-card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-3">
                  <AlertTriangle size={22} className="text-amber-500" />
                  发现问题
                </h3>
                <div className="space-y-3">
                  {analysis.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl"
                    >
                      <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-base text-slate-700 leading-relaxed">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis && analysis.suggestions.length > 0 && (
              <div className="premium-card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-3">
                  <ShoppingBag size={22} className="text-indigo-500" />
                  建议购买
                </h3>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                    >
                      <CheckCircle size={18} className="text-indigo-500 flex-shrink-0" />
                      <p className="text-base text-slate-700 leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis && analysis.issues.length === 0 && (
              <div className="premium-card p-8 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={36} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">衣橱很健康!</h3>
                <p className="text-slate-500">你的衣橱搭配完善，继续保持</p>
              </div>
            )}

            <div className="premium-card p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">🔔</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">智能提醒</h3>
                  <p className="text-sm text-slate-400">获取换季搭配建议</p>
                </div>
              </div>
              <ArrowRight size={22} className="text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
