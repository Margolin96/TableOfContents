import { PagesData, PageId, PagesMap } from "../types/types";

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

/**
 * Creates a debounced version of a function.
 * @param {Function} fn - The function to be debounced.
 * @param {number} ms - The delay time in milliseconds. Defaults to 500 milliseconds.
 * @returns {Function} The debounced version of the provided function.
 */
export const debounce = (fn: Function, ms: number = 500): Function => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

/**
 * Returns an array of all parent page IDs for a given page ID.
 * @param {PagesMap} pages - A map containing the data of all pages.
 * @param {PageId} id - The ID of the page for which to find parent pages.
 * @returns {PageId[]} An array of parent page IDs.
 */
export const getAllParents = (pages: PagesMap, id: PageId): PageId[] => {
  let currentPage = pages[id];

  if (!currentPage) return [];

  let page = currentPage.parentId ? pages[currentPage.parentId] : null;

  const parents = new Set([currentPage.id]);

  while (page && page.level >= 0) {
    if (parents.has(page.id)) {
      // Preventing looping.
      console.warn('Recurring parent', page.id);

      return [];
    }

    parents.add(page.id);
    page = page.parentId ? pages[page.parentId] : null;
  }

  return Array.from(parents.values());
}

/**
 * Returns filtered pages based on the search query.
 *
 * @param {string} query - The search query.
 * @param {PageId[]} topLevelIds - An array of top-level page IDs.
 * @param {PagesMap} pages - A map containing the data of all pages.
 * @returns {FilteredPages} An object with filtered pages and their top-level IDs.
 */
export const getFilteredPages = (
  query: string,
  topLevelIds: PageId[],
  pages: PagesMap
): PagesData => {
  if (!query.trim()) return {
    topLevelIds,
    pages,
  };

  const filteredPages: PagesMap = {};
  const sanitizedQuery = query.toLowerCase();

  Object.values(pages).forEach((page) => {
    if (page.title.toLowerCase().includes(sanitizedQuery)) {
      filteredPages[page.id] = { ...page };

      const parentsIds = getAllParents(pages, page.id);

      parentsIds.forEach((pageId) => {
        filteredPages[pageId] = { ...pages[pageId] };
      });
    }
  });

  Object.values(filteredPages).forEach((page) => {
    page.pages = page.pages?.filter((pageId) => pageId in filteredPages);
  });
  
  return {
    pages: filteredPages,
    topLevelIds: topLevelIds.filter((pageId) => pageId in filteredPages),
  };
}
