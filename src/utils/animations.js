export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// Respect prefers-reduced-motion
export function getMotionProps(variants) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return {};
  return { initial: 'hidden', animate: 'visible', variants };
}

// Gradient placeholder per category
const GRADIENTS = [
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-600',
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-600',
  'from-sky-400 to-blue-600',
  'from-yellow-400 to-amber-600',
];

export function categoryGradient(str = '') {
  const idx = str.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

export const FOOD_EMOJI = {
  biryani: '🍛', burger: '🍔', pizza: '🍕', pasta: '🍝',
  dessert: '🍮', drink: '🥤', default: '🍽️',
};

export function getFoodEmoji(name = '', category = '') {
  const s = (name + category).toLowerCase();
  if (s.includes('biryani') || s.includes('rice')) return '🍛';
  if (s.includes('burger')) return '🍔';
  if (s.includes('pizza')) return '🍕';
  if (s.includes('pasta') || s.includes('noodle')) return '🍝';
  if (s.includes('cake') || s.includes('dessert') || s.includes('sweet') || s.includes('kunafa') || s.includes('cheesecake')) return '🍰';
  if (s.includes('coffee') || s.includes('cappuccino')) return '☕';
  if (s.includes('milkshake') || s.includes('shake')) return '🥤';
  if (s.includes('lemon') || s.includes('juice')) return '🍋';
  return '🍽️';
}
