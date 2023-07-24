const widthClasses = [
  'w-8/12',
  'w-9/12',
  'w-10/12',
  'w-11/12',
  'w-12/12',
];

/**
 * Get a random width class.
 * @returns {string} Width class.
 */
export const getRandomWidthClass = (): string => {
  return widthClasses[Math.floor(Math.random() * widthClasses.length)];
};

const paddingClasses = [
  'pl-8',
  'pl-12',
  'pl-16',
  'pl-20',
  'pl-24',
  'pl-28',
  'pl-32',
  'pl-36',
  'pl-40',
  'pl-44',
  'pl-48',
  'pl-52',
  'pl-56',
  'pl-60',
  'pl-64',
];

/**
 * Get a padding left class from the array based on the given level.
 * If the level is out of bounds, it will be clamped to the nearest valid level.
 * @param {number} level - The level of the element in the tree.
 * @returns {string} Padding left class.
 */
export const getPaddingLeftClass = (level: number): string => {
  // Ensure the level is within bounds of the array.
  return paddingClasses[Math.max(0, Math.min(level, paddingClasses.length))];
};
