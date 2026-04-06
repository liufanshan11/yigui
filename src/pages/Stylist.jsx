import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Heart, Check, MessageCircle, X, Send } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import { generateOutfit } from '../utils/aiLogic';
import CinematicHeader from '../components/CinematicHeader';
import ClothingCard from '../components/ClothingCard';
import Toast from '../components/Toast';

const API_BASE_URL = '';

const scenes = [
  { key: 'commute', label: '通勤', icon: '💼' },
  { key: 'date', label: '约会', icon: '💕' },
  { key: 'sport', label: '运动', icon: '🏃' },
  { key: 'casual', label: '休闲', icon: '🧢' },
];

const temps = [
  { key: 'cool', label: '低于 15°C' },
  { key: 'mild', label: '15-25°C' },
  { key: 'warm', label: '高于 25°C' },
];

const bodyTypes = [
  { key: 'slim', label: '偏瘦' },
  { key: 'normal', label: '标准' },
  { key: 'muscular', label: '肌肉型' },
  { key: 'curvy', label: '丰满' },
  { key: 'pear', label: '梨形' },
  { key: 'apple', label: '苹果形' },
  { key: 'rectangle', label: '矩形' },
  { key: 'hourglass', label: '沙漏形' },
];

const loadingMessages = [
  'AI 正在分析色彩美学...',
  '正在匹配风格...',
  '生成穿搭方案...',
];

const Stylist = () => {
  const { items, saveOutfit } = useWardrobe();
  const [selectedScene, setSelectedScene] = useState('commute');
  const [selectedTemp, setSelectedTemp] = useState('mild');
  const [isLoading, setIsLoading] = useState(false);
  const [outfits, setOutfits] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [savedOutfitIds, setSavedOutfitIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  
  const [showConsult, setShowConsult] = useState(false);
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultResult, setConsultResult] = useState(null);
  const [consultForm, setConsultForm] = useState({
    height: '170',
    weight: '65',
    bodyType: 'normal',
    preferences: ''
  });

  const updateConsultForm = (key, value) => {
    setConsultForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumericInput = (key, rawValue) => {
    const normalized = rawValue.replace(/[^\d.]/g, '').slice(0, 6);
    updateConsultForm(key, normalized);
  };

  const getTemperatureValue = (key) => {
    switch (key) {
      case 'cool': return 10;
      case 'mild': return 20;
      case 'warm': return 28;
      default: return 20;
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setOutfits(null);
    setSavedOutfitIds(new Set());

    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingMessage(loadingMessages[i]);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    const temperature = getTemperatureValue(selectedTemp);
    const generatedOutfits = generateOutfit(items, selectedScene, temperature);
    setOutfits(generatedOutfits);
    setIsLoading(false);
  };

  const handleSaveOutfit = (outfit, outfitId) => {
    if (savedOutfitIds.has(outfitId)) {
      setToast({ message: '该搭配已保存', type: 'info' });
      return;
    }

    saveOutfit({
      ...outfit,
      scene: selectedScene,
      temperature: selectedTemp,
    });
    
    setSavedOutfitIds((prev) => new Set([...prev, outfitId]));
    setToast({ message: '搭配已保存到收藏', type: 'success' });
  };

  const handleConsult = async () => {
    setConsultLoading(true);
    setConsultResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/style-consult`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          height: consultForm.height,
          weight: consultForm.weight,
          bodyType: consultForm.bodyType,
          scene: selectedScene,
          preferences: consultForm.preferences
        })
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        setConsultResult(result.data);
      } else {
        setToast({ message: result.error || '获取建议失败', type: 'error' });
      }
    } catch (err) {
      console.error('Consult error:', err);
      setToast({ message: '无法连接到服务器', type: 'error' });
    } finally {
      setConsultLoading(false);
    }
  };

  const getSceneLabel = (key) => {
    return scenes.find(s => s.key === key)?.label || key;
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-8">
        <CinematicHeader
          eyebrow="AI Stylist Studio"
          title="AI 搭配师"
          description="输入场景与温度，系统自动组合你的衣橱单品，生成可收藏、可复用的穿搭方案。"
          image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=700&fit=crop&auto=format"
        />

        <div className="premium-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">搭配参数面板</h2>
              <p className="text-sm text-slate-400 mt-1">选择场景、温度并生成方案</p>
            </div>
            <button
              onClick={() => setShowConsult(true)}
              className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform"
            >
              <MessageCircle size={22} className="text-indigo-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="premium-card p-6">
              <h3 className="text-base font-medium text-slate-500 mb-5">选择场景</h3>
              <div className="grid grid-cols-2 gap-3">
                {scenes.map((scene) => (
                  <button
                    key={scene.key}
                    onClick={() => setSelectedScene(scene.key)}
                    className={`p-4 rounded-2xl text-center transition-all duration-200 hover:scale-105 ${
                      selectedScene === scene.key
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{scene.icon}</span>
                    <span className="text-sm font-medium">{scene.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="premium-card p-6">
              <h3 className="text-base font-medium text-slate-500 mb-5">选择温度</h3>
              <div className="space-y-2">
                {temps.map((temp) => (
                  <button
                    key={temp.key}
                    onClick={() => setSelectedTemp(temp.key)}
                    className={`w-full p-4 rounded-2xl text-center transition-all duration-200 hover:scale-[1.02] ${
                      selectedTemp === temp.key
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm font-medium">{temp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="premium-button w-full h-14 flex items-center justify-center gap-2 text-base disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  生成搭配
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-2">
            {isLoading && (
              <div className="py-8 animate-pulse">
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[3/4] bg-slate-200 rounded-2xl" />
                  ))}
                </div>
                <div className="mt-6 h-8 bg-slate-200 rounded-xl w-1/2 mx-auto" />
              </div>
            )}

            {outfits && !isLoading && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">为你推荐</h3>
                  <button
                    onClick={handleGenerate}
                    className="text-slate-900 text-sm font-medium flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <RefreshCw size={14} />
                    换一批
                  </button>
                </div>

                {outfits.map((outfit, index) => {
                  const outfitId = `${outfit.top?.id || 'top'}_${outfit.bottom?.id || 'bottom'}_${outfit.shoes?.id || 'shoes'}_${outfit.accessory?.id || 'none'}_${index}`;
                  const isSaved = savedOutfitIds.has(outfitId);
                  const hasAccessory = outfit.accessory;
                  
                  return (
                    <div
                      key={index}
                      className="premium-card p-5 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-400">方案 {index + 1}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-sm text-slate-400">{getSceneLabel(selectedScene)}</span>
                        </div>
                        <button
                          onClick={() => handleSaveOutfit(outfit, outfitId)}
                          className={`p-2.5 rounded-full transition-all hover:scale-110 ${
                            isSaved 
                              ? 'bg-red-50 text-red-500' 
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {isSaved ? <Check size={20} /> : <Heart size={20} />}
                        </button>
                      </div>
                      
                      <div className={`grid gap-3 ${hasAccessory ? 'grid-cols-4' : 'grid-cols-3'}`}>
                        <ClothingCard item={outfit.top} onClick={() => {}} />
                        <ClothingCard item={outfit.bottom} onClick={() => {}} />
                        <ClothingCard item={outfit.shoes} onClick={() => {}} />
                        {hasAccessory && (
                          <ClothingCard item={outfit.accessory} onClick={() => {}} />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-500">
                          {outfit.top?.subCategory}
                        </span>
                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-500">
                          {outfit.bottom?.subCategory}
                        </span>
                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-500">
                          {outfit.shoes?.subCategory}
                        </span>
                        {hasAccessory && (
                          <span className="px-3 py-1.5 bg-amber-50 rounded-lg text-xs text-amber-600">
                            {outfit.accessory?.subCategory}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && !outfits && (
              <div className="py-20 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                  <Sparkles size={40} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">选择场景和温度，开始生成穿搭</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConsult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div
            className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-900">AI 穿搭咨询</h2>
              <button onClick={() => setShowConsult(false)} className="p-2 hover:scale-110 transition-transform">
                <X size={22} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500 mb-2 block">身高 (cm)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={consultForm.height}
                    onChange={(e) => handleNumericInput('height', e.target.value)}
                    className="w-full h-12 px-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-900 caret-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-slate-300/80"
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-500 mb-2 block">体重 (kg)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={consultForm.weight}
                    onChange={(e) => handleNumericInput('weight', e.target.value)}
                    className="w-full h-12 px-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-900 caret-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-slate-300/80"
                    placeholder="65"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-3 block">体型</label>
                <div className="grid grid-cols-4 gap-2">
                  {bodyTypes.map((type) => (
                    <button
                      key={type.key}
                      onClick={() => updateConsultForm('bodyType', type.key)}
                      className={`p-3 rounded-xl text-sm transition-all hover:scale-105 ${
                        consultForm.bodyType === type.key
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500 mb-2 block">偏好 (可选)</label>
                <textarea
                  value={consultForm.preferences}
                  onChange={(e) => updateConsultForm('preferences', e.target.value)}
                  className="w-full h-24 px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-900 caret-slate-900 placeholder:text-slate-400 text-base resize-none focus:outline-none focus:ring-2 focus:ring-slate-300/80"
                  placeholder="例如：喜欢简约风格，不喜欢太花的颜色..."
                />
              </div>

              <button
                onClick={handleConsult}
                disabled={consultLoading}
                className="premium-button w-full h-14 flex items-center justify-center gap-2"
              >
                {consultLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    AI 分析中...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    获取穿搭建议
                  </>
                )}
              </button>

              {consultResult && (
                <div className="mt-5 p-5 bg-indigo-50 rounded-2xl animate-fade-in">
                  <h4 className="font-semibold text-slate-900 mb-4">穿搭建议</h4>
                  
                  {consultResult.body_analysis && (
                    <div className="mb-4">
                      <p className="text-xs text-indigo-500 mb-1">身材分析</p>
                      <p className="text-sm text-slate-700">{consultResult.body_analysis}</p>
                    </div>
                  )}
                  
                  {consultResult.style_direction && (
                    <div className="mb-4">
                      <p className="text-xs text-indigo-500 mb-1">风格方向</p>
                      <p className="text-sm text-slate-700">{consultResult.style_direction}</p>
                    </div>
                  )}

                  {consultResult.top_recommendations && (
                    <div className="mb-4">
                      <p className="text-xs text-indigo-500 mb-1">上衣建议</p>
                      {consultResult.top_recommendations.map((item, i) => (
                        <p key={i} className="text-sm text-slate-700">• {item.type} - {item.length} {item.fit}</p>
                      ))}
                    </div>
                  )}

                  {consultResult.bottom_recommendations && (
                    <div className="mb-4">
                      <p className="text-xs text-indigo-500 mb-1">下装建议</p>
                      {consultResult.bottom_recommendations.map((item, i) => (
                        <p key={i} className="text-sm text-slate-700">• {item.type} - {item.length}</p>
                      ))}
                    </div>
                  )}

                  {consultResult.shoe_recommendations && (
                    <div className="mb-4">
                      <p className="text-xs text-indigo-500 mb-1">鞋履建议</p>
                      {consultResult.shoe_recommendations.map((item, i) => (
                        <p key={i} className="text-sm text-slate-700">• {item.type} - {item.heel_height}</p>
                      ))}
                    </div>
                  )}

                  {consultResult.tips && (
                    <div className="pt-4 border-t border-indigo-100">
                      <p className="text-xs text-indigo-500 mb-1">小贴士</p>
                      <p className="text-sm text-slate-700">{consultResult.tips}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Stylist;
