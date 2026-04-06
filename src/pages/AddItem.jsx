import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, Sparkles, X } from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import CinematicHeader from '../components/CinematicHeader';
import Toast from '../components/Toast';
import { apiUrl } from '../utils/apiBase';

const AddItem = () => {
  const navigate = useNavigate();
  const { addItem } = useWardrobe();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedData, setRecognizedData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsRecognizing(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setImage(imageDataUrl);

      const response = await fetch(apiUrl('/api/analyze'), {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        
        const categoryMap = {
          '上装': 'Tops',
          '下装': 'Bottoms',
          '鞋': 'Shoes',
          '配饰': 'Accessories'
        };

        const category = categoryMap[data.meta?.category] || 'Tops';
        const subCategory = data.meta?.sub_category || data.meta?.subCategory || 'T-shirt';
        const color = data.meta?.color || 'White';
        const styleStr = data.meta?.style || 'Casual';
        const style = styleStr.includes('正式') ? 'Formal' : 
                      styleStr.includes('运动') ? 'Sporty' : 
                      styleStr.includes('复古') ? 'Vintage' : 'Casual';

        const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
        const season = SEASONS[Math.floor(Math.random() * SEASONS.length)];

        setRecognizedData({
          category,
          subCategory,
          color,
          season,
          style,
          report: data.report
        });
        setShowToast(true);
      } else {
        setError(result.error || '识别失败，请重试');
      }
    } catch (err) {
      console.error('Recognition error:', err);
      setError('无法连接到服务器，请确保后端已启动');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleSubmit = () => {
    if (!image || !recognizedData) return;

    addItem({
      image,
      category: recognizedData.category,
      subCategory: recognizedData.subCategory,
      color: recognizedData.color,
      season: recognizedData.season,
      style: recognizedData.style,
    });

    navigate('/wardrobe');
  };

  const handleRemoveImage = () => {
    setImage(null);
    setRecognizedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-8">
        <CinematicHeader
          eyebrow="AI Scanner"
          title="添加衣物"
          description="上传服饰图片，系统将自动提取分类、风格和颜色特征，并给出可读的搭配点评。"
          image="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1600&h=700&fit=crop&auto=format"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div
              onClick={() => !isRecognizing && fileInputRef.current?.click()}
              className={`premium-card overflow-hidden transition-all cursor-pointer ${
                image ? 'p-0' : 'p-12 border-2 border-dashed border-slate-200 hover:border-slate-300'
              }`}
            >
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:scale-110 transition-transform"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                    <Upload size={32} className="text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-medium text-lg">点击上传图片</p>
                  <p className="text-slate-400 text-sm mt-2">支持 JPG、PNG 格式</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {isRecognizing && (
              <div className="premium-card p-6 mt-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Loader2 size={28} className="text-slate-900 animate-spin" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium text-lg">AI 正在识别中...</p>
                    <p className="text-slate-400 text-sm mt-1">正在分析服装特征</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="premium-card p-5 bg-red-50 border border-red-100 mt-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {recognizedData && !isRecognizing && (
              <div className="premium-card p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles size={22} className="text-indigo-500" />
                  <h3 className="text-lg font-semibold text-slate-900">AI 识别结果</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400 mb-1">分类</p>
                    <p className="text-base font-medium text-slate-700">
                      {categoryLabels[recognizedData.category]}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400 mb-1">子类</p>
                    <p className="text-base font-medium text-slate-700">
                      {recognizedData.subCategory}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400 mb-1">颜色</p>
                    <p className="text-base font-medium text-slate-700">
                      {recognizedData.color}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400 mb-1">季节</p>
                    <p className="text-base font-medium text-slate-700">
                      {seasonLabels[recognizedData.season]}
                    </p>
                  </div>
                  <div className="col-span-2 bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400 mb-1">风格</p>
                    <p className="text-base font-medium text-slate-700">
                      {styleLabels[recognizedData.style]}
                    </p>
                  </div>
                </div>

                {recognizedData.report && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-xs text-indigo-500 mb-2">AI 点评</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{recognizedData.report}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!recognizedData || isRecognizing}
                className="premium-button flex-1 h-14 text-base disabled:opacity-50"
              >
                添加到衣橱
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-8 h-14 bg-white text-slate-600 rounded-2xl font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="AI 已自动识别分类与属性"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default AddItem;
