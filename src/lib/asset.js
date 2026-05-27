const BASE = import.meta.env.VITE_API_URL ?? '';

export const assetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  return `${BASE}${path}`;
};
