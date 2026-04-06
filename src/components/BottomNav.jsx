import { Home, Shirt, Sparkles, Users } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: '首页', index: 0 },
    { to: '/wardrobe', icon: Shirt, label: '衣橱', index: 1 },
    { to: '/community', icon: Users, label: '社区', index: 2 },
    { to: '/stylist', icon: Sparkles, label: '搭配', index: 3 },
  ];

  const getCurrentIndex = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/wardrobe')) return 1;
    if (path.startsWith('/community')) return 2;
    if (path.startsWith('/stylist')) return 3;
    return 0;
  };

  const currentIndex = getCurrentIndex();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.25rem)] max-w-md lg:hidden">
      <div className="flex items-center justify-around h-[72px] px-2 py-2 rounded-[1.4rem] border border-white/70 bg-white/75 backdrop-blur-2xl shadow-[0_16px_34px_rgba(15,23,42,0.14)]">
        {navItems.map(({ to, icon: Icon, label, index }) => {
          const isActive = currentIndex === index;

          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center w-[74px] h-[52px] rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-slate-900 text-white shadow-md shadow-slate-900/30' : 'text-slate-500'
              }`}
            >
              <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.35 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse-soft" />
                )}
              </div>
              <span className={`text-[11px] mt-1.5 font-semibold tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
