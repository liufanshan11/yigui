const normalizeBase = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.replace(/\/+$/, '');
};

// 开发环境默认走 Vite 代理（空字符串），生产环境从 VITE_API_BASE_URL 读取后端域名
export const API_BASE_URL = normalizeBase(import.meta.env.VITE_API_BASE_URL) || '';

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

if (!import.meta.env.DEV && !API_BASE_URL) {
  console.warn(
    '[SmartWardrobe] 未配置 VITE_API_BASE_URL，生产环境 API 请求将回落到当前站点域名。'
  );
}
