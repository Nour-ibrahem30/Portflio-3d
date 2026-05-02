/**
 * Unified Color Configuration for Portfolio Website
 * Contains 10 professional dark gradients
 * Primary: Deep night blue (core identity)
 */

const gradients = [
  {
    id: 1,
    name: 'Deep night blue',
    colors: ['#1e3a8a', '#3b82f6'],
    angle: 135
  },
  {
    id: 2,
    name: 'Electric ocean glow',
    colors: ['#2563eb', '#06b6d4'],
    angle: 135
  },
  {
    id: 3,
    name: 'Steel calm blue',
    colors: ['#475569', '#64748b'],
    angle: 135
  },
  {
    id: 4,
    name: 'Midnight gradient',
    colors: ['#334155', '#475569'],
    angle: 135
  },
  {
    id: 5,
    name: 'Dark neutral tech',
    colors: ['#374151', '#6b7280'],
    angle: 135
  },
  {
    id: 6,
    name: 'Deep purple night',
    colors: ['#4c1d95', '#7c3aed'],
    angle: 135
  },
  {
    id: 7,
    name: 'Dark warm accent',
    colors: ['#dc2626', '#f97316'],
    angle: 135
  },
  {
    id: 8,
    name: 'Space blue energy',
    colors: ['#1e40af', '#3b82f6'],
    angle: 135
  },
  {
    id: 9,
    name: 'Cold warm clash',
    colors: ['#0ea5e9', '#f59e0b'],
    angle: 135
  },
  {
    id: 10,
    name: 'Calm professional depth',
    colors: ['#475569', '#64748b'],
    angle: 135
  }
];

/**
 * Get gradient object by ID
 * @param {number} id - Gradient ID (1-10)
 * @returns {object} Gradient object
 */
export const getGradient = (id = 1) => {
  return gradients.find(g => g.id === id) || gradients[0];
};

/**
 * Get CSS gradient string
 * @param {number} id - Gradient ID (1-10)
 * @returns {string} CSS gradient string
 */
export const getCSSGradient = (id = 1) => {
  const gradient = getGradient(id);
  const colorStops = gradient.colors.join(', ');
  return `linear-gradient(${gradient.angle}deg, ${colorStops})`;
};

/**
 * Get gradient by name
 * @param {string} name - Gradient name
 * @returns {object} Gradient object
 */
export const getGradientByString = (name) => {
  return gradients.find(g => g.name.toLowerCase() === name.toLowerCase()) || gradients[0];
};

/**
 * Get random gradient
 * @returns {object} Random gradient object
 */
export const getRandomGradient = () => {
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
};

// Export primary colors for direct use
export const primaryColors = {
  darkBase: '#1e3a8a',
  accent: '#3b82f6',
  gradient: getCSSGradient(1)
};

export default gradients;
