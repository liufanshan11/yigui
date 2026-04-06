import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import CinematicHeader from '../components/CinematicHeader';
import Toast from '../components/Toast';

const createPoster = (title, subtitle) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1f2937"/>
          <stop offset="55%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <radialGradient id="g2" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#g1)"/>
      <rect width="1200" height="900" fill="url(#g2)"/>
      <rect x="52" y="52" width="1096" height="796" rx="28" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <text x="86" y="700" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="66" font-weight="700">${title}</text>
      <text x="86" y="760" fill="#94a3b8" font-family="Arial, sans-serif" font-size="30">${subtitle}</text>
    </svg>
  `)}`;

const POST_IMAGE_FALLBACK = createPoster('校园穿搭', '图片加载失败，已显示默认封面');
const SPORT_GIRL_POSTER = createPoster('运动女孩', '舒适、显瘦、出片的校园运动搭配');

const MOCK_POSTS = [
  {
    id: 1,
    username: '时尚博主小王',
    avatar: '👩‍🎓',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=450&fit=crop',
    content: '今日上课穿搭：灰色短卫衣 + 直筒牛仔裤 + 小白鞋，省心又好看。',
    tags: { category: '休闲', style: '简约' },
    likes: 128,
    time: '2小时前',
    isOwner: false,
    likedByMe: false
  },
  {
    id: 2,
    username: '穿搭课代表',
    avatar: '👨‍🎓',
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=450&fit=crop',
    content: '通勤版学院风：卡其风衣 + 条纹衬衫 + 阔腿西裤，一套就很有气质。',
    tags: { category: '通勤', style: '学院' },
    likes: 256,
    time: '5小时前',
    isOwner: false,
    likedByMe: false
  },
  {
    id: 3,
    username: '大学穿搭日记',
    avatar: '🏃‍♀️',
    image_url: SPORT_GIRL_POSTER,
    content: '运动女孩来啦！短款运动外套 + 高腰瑜伽裤，去操场和健身房都很能打。',
    tags: { category: '运动', style: '活力' },
    likes: 89,
    time: '昨天',
    isOwner: false,
    likedByMe: false
  },
  {
    id: 4,
    username: '校园潮人',
    avatar: '🧢',
    image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=450&fit=crop',
    content: '美式街头搭配：格纹衬衫 + 工装裤 + 冷帽，音乐节和社团活动都适配。',
    tags: { category: '街头', style: '复古' },
    likes: 167,
    time: '昨天',
    isOwner: false,
    likedByMe: false
  },
  {
    id: 5,
    username: '甜酷衣橱',
    avatar: '💅',
    image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=450&fit=crop',
    content: '甜酷日常：短款针织 + 百褶短裙 + 长袜，校园拍照很出片。',
    tags: { category: '甜酷', style: '韩系' },
    likes: 312,
    time: '2天前',
    isOwner: false,
    likedByMe: false
  },
  {
    id: 6,
    username: '理工男穿搭',
    avatar: '👨‍💻',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop',
    content: '理工男万能公式：纯色卫衣 + 宽松牛仔裤 + 复古跑鞋，简单耐看。',
    tags: { category: '休闲', style: '简约' },
    likes: 78,
    time: '3天前',
    isOwner: false,
    likedByMe: false
  }
];

const Community = () => {
  const [posts, setPosts] = useState([]);
  const loading = false;
  const [showCreate, setShowCreate] = useState(false);
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedPosts = localStorage.getItem('community_posts');
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      const normalizedPosts = parsedPosts.map((post) => {
        const nextPost = { ...post };
        if (nextPost.isOwner === undefined) nextPost.isOwner = false;
        if (nextPost.likedByMe === undefined) nextPost.likedByMe = false;
        if (
          nextPost.id === 3 &&
          typeof nextPost.image_url === 'string' &&
          nextPost.image_url.includes('1529139574466-a302c27e3844')
        ) {
          nextPost.image_url = SPORT_GIRL_POSTER;
        }
        return nextPost;
      });
      setPosts(normalizedPosts);
      localStorage.setItem('community_posts', JSON.stringify(normalizedPosts));
    } else {
      setPosts(MOCK_POSTS);
      localStorage.setItem('community_posts', JSON.stringify(MOCK_POSTS));
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content) {
      setToast({ message: '请输入穿搭心得', type: 'error' });
      return;
    }

    setUploading(true);

    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        username: '我',
        avatar: '🙂',
        image_url: image || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=450&fit=crop',
        content,
        tags: { category: '分享', style: '日常' },
        likes: 0,
        time: '刚刚',
        isOwner: true,
        likedByMe: false
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('community_posts', JSON.stringify(updatedPosts));

      setToast({ message: '发布成功', type: 'success' });
      setShowCreate(false);
      setImage(null);
      setContent('');
      setUploading(false);
    }, 500);
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        if (post.likedByMe) {
          return post;
        }
        return { ...post, likes: post.likes + 1, likedByMe: true };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
  };

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
    setToast({ message: '已删除', type: 'success' });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-8">
        <CinematicHeader
          eyebrow="校园穿搭社区"
          title="时尚社区"
          description="发布你的穿搭故事，获取同学灵感，用真实场景沉淀可复用的搭配经验。"
          image="https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=1600&h=700&fit=crop&auto=format"
        />

        <div className="premium-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">穿搭动态</h2>
              <p className="text-sm text-slate-400 mt-1">分享你的穿搭灵感</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Plus size={22} className="text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 size={40} className="text-slate-300 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">📷</span>
              </div>
              <p className="text-slate-500 text-lg">还没有帖子，快来发布第一篇吧</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="premium-card overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{post.username}</p>
                        <p className="text-xs text-slate-400">{post.time}</p>
                      </div>
                    </div>
                    {post.isOwner && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full aspect-[4/3] object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = POST_IMAGE_FALLBACK;
                    }}
                  />
                )}
                <div className="p-5">
                  <p className="text-base text-slate-700 leading-relaxed">{post.content}</p>

                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.category && (
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">
                          {post.tags.category}
                        </span>
                      )}
                      {post.tags.style && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                          {post.tags.style}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-5 mt-5 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      disabled={post.likedByMe}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        post.likedByMe
                          ? 'text-red-500 cursor-default'
                          : 'text-slate-400 hover:text-red-500 cursor-pointer'
                      }`}
                    >
                      <Heart size={18} fill={post.likedByMe ? 'currentColor' : 'none'} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 text-sm hover:text-blue-500 transition-colors">
                      <MessageCircle size={18} />
                      评论
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-900">发布穿搭</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:scale-110 transition-transform">
                <X size={22} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm text-slate-600 mb-3 block">上传图片（可选）</label>
                <input
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full aspect-[4/3] object-cover rounded-2xl"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:scale-110 transition-transform"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="post-image" className="block w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="text-center">
                      <Plus size={32} className="text-slate-400 mx-auto mb-2" />
                      <span className="text-slate-400">点击上传图片</span>
                    </div>
                  </label>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-3 block">穿搭心得</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-28 px-5 py-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-900 caret-slate-900 placeholder:text-slate-400 text-base resize-none focus:outline-none focus:ring-2 focus:ring-slate-300/80"
                  placeholder="分享你的穿搭心得..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={uploading || !content}
                className="premium-button w-full h-14 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    发布
                  </>
                )}
              </button>
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

export default Community;
