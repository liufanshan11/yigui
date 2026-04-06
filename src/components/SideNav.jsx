import { Home, Shirt, Sparkles, Users, Plus, User, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Home, label: '首页', description: '总览面板' },
  { to: '/wardrobe', icon: Shirt, label: '衣橱', description: '单品管理' },
  { to: '/stylist', icon: Sparkles, label: '智能搭配', description: '算法推荐' },
  { to: '/community', icon: Users, label: '社区', description: '穿搭分享' },
  { to: '/profile', icon: User, label: '诊断', description: '数据分析' },
];

const SideNav = () => {
  const location = useLocation();

  const getCurrentIndex = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/wardrobe')) return 1;
    if (path.startsWith('/stylist')) return 2;
    if (path.startsWith('/community')) return 3;
    if (path.startsWith('/profile')) return 4;
    return 0;
  };

  const currentIndex = getCurrentIndex();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[300px] z-50 hidden lg:flex flex-col border-r border-white/10 bg-black/80 backdrop-blur-2xl">
      <div className="relative p-8 pb-6 border-b border-white/10">
        <div className="absolute right-4 top-4 text-[10px] tracking-[0.26em] text-lime-300 font-semibold">LIVE</div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-300 via-cyan-300 to-orange-400 text-black font-black text-lg flex items-center justify-center shadow-[0_0_28px_rgba(217,255,63,0.45)]">
          SW
        </div>
        <h1 className="mt-4 font-display text-2xl text-white leading-none">智慧衣橱</h1>
        <p className="mt-2 text-xs tracking-[0.2em] text-white/45">时尚算法引擎</p>

        <div className="mt-5 rounded-2xl border border-lime-300/35 bg-lime-300/10 px-3 py-3">
          <p className="text-xs text-lime-200 leading-relaxed">用算法把衣橱变成你的时尚编辑部</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5">
        <div className="space-y-2">
          {navItems.map(({ to, icon: Icon, label, description }, index) => {
            const isActive = currentIndex === index;
            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-lime-300 text-black border-lime-200 shadow-[0_10px_22px_rgba(217,255,63,0.38)]'
                    : 'bg-white/[0.03] text-white/75 border-white/10 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className={`text-[11px] tracking-[0.12em] ${isActive ? 'text-black/55' : 'text-white/35'}`}>
                    {description}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </div>

        <NavLink
          to="/add"
          className="mt-7 flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-lime-300 text-black font-bold shadow-[0_12px_24px_rgba(251,146,60,0.35)]"
        >
          <Plus size={18} strokeWidth={2.4} />
          上传衣物
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="h-11 rounded-xl border border-white/15 bg-white/[0.04] text-white/70 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.08] transition-colors">
          <Settings size={16} />
          <span className="text-sm">系统设置</span>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
