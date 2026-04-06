import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shirt, BarChart3, MessageSquare, Plus } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import StatCard from '../components/StatCard';
import RunwayMarquee from '../components/RunwayMarquee';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&h=1400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=1400&fit=crop&auto=format',
];

const RUNWAY_STREAM = [
  {
    tag: '前卫',
    title: '高对比层叠穿搭',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&auto=format',
  },
  {
    tag: '极简',
    title: '低饱和极简态度',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop&auto=format',
  },
  {
    tag: '街头',
    title: '机能风混搭校园感',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=1000&fit=crop&auto=format',
  },
  {
    tag: '高街',
    title: '剪裁感与深色调',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=1000&fit=crop&auto=format',
  },
  {
    tag: '运动',
    title: '运动核与质感并存',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&auto=format',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-10 pt-10 pb-8">
        <section className="neo-hero-shell mb-5">
          <div className="neo-hero-grid">
            <div className="neo-hero-copy">
              <div className="neo-tag">
                <Sparkles size={13} />
                时尚搭配算法实验室
              </div>

              <h1 className="neo-hero-title">
                穿搭
                <span>有声量</span>
              </h1>
              <p className="neo-hero-subtitle">
                智慧衣橱把衣物数据、场景语义与风格偏好融合成可解释的时尚搭配算法，让每一次出门都像一次个人秀场。
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <button
                  onClick={() => navigate('/add')}
                  className="neo-btn-solid"
                >
                  <Plus size={16} />
                  上传单品
                </button>
                <button
                  onClick={() => navigate('/stylist')}
                  className="neo-btn-ghost"
                >
                  <Sparkles size={16} />
                  生成搭配
                </button>
              </div>
            </div>

            <div className="neo-collage">
              <article className="neo-collage-card card-a">
                <img src={HERO_IMAGES[0]} alt="都市穿搭" />
                <div className="neo-collage-label">都市节奏</div>
              </article>
              <article className="neo-collage-card card-b">
                <img src={HERO_IMAGES[1]} alt="户外机能" />
                <div className="neo-collage-label">户外机能</div>
              </article>
              <article className="neo-collage-card card-c">
                <img src={HERO_IMAGES[2]} alt="复古新潮" />
                <div className="neo-collage-label">新潮复古</div>
              </article>
            </div>
          </div>
        </section>

        <div className="neo-ticker mb-6">
          <div className="neo-ticker-track">
            <span>时尚搭配算法引擎</span>
            <span>场景化穿搭生成</span>
            <span>衣橱健康度分析</span>
            <span>个人风格记忆</span>
            <span>时尚搭配算法引擎</span>
            <span>场景化穿搭生成</span>
            <span>衣橱健康度分析</span>
            <span>个人风格记忆</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <WeatherCard />
            <RunwayMarquee items={RUNWAY_STREAM} />
          </div>

          <div className="space-y-4">
            <StatCard />

            <div
              onClick={() => navigate('/wardrobe')}
              className="neo-entry-card"
            >
              <div className="neo-entry-icon bg-lime-300 text-black">
                <Shirt size={24} />
              </div>
              <div className="flex-1">
                <h4>我的衣橱</h4>
                <p>管理你的潮流单品库</p>
              </div>
              <ArrowRight size={19} />
            </div>

            <div
              onClick={() => navigate('/community')}
              className="neo-entry-card"
            >
              <div className="neo-entry-icon bg-cyan-300 text-black">
                <MessageSquare size={24} />
              </div>
              <div className="flex-1">
                <h4>时尚社区</h4>
                <p>发布与浏览校园穿搭</p>
              </div>
              <ArrowRight size={19} />
            </div>

            <div
              onClick={() => navigate('/profile')}
              className="neo-entry-card"
            >
              <div className="neo-entry-icon bg-orange-300 text-black">
                <BarChart3 size={24} />
              </div>
              <div className="flex-1">
                <h4>衣橱诊断</h4>
                <p>数据驱动的穿搭反馈</p>
              </div>
              <ArrowRight size={19} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
