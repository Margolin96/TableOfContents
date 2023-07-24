import { atom } from "jotai";

import { PageId, PagesMap } from "../types";

/**
 * Atom to store the ID of the currently selected page or null if none is selected.
 */
export const selectedPageAtom = atom<PageId | null, [id: PageId | null], void>(null, () => {});

/**
 * Atom to store a set of expanded page IDs.
 */
export const expandedIdsAtom = atom(new Set<PageId>());

/**
 * Atom to update the 'expandedIdsAtom' based on the ID of the page and whether it's expanded or not.
 */
export const updateExpandedByIdAtom = atom<null, [id: PageId, isExpanded: Boolean], void>(null, () => {});

/**
 * Atom to store a map of pages (key: page ID, value: page data).
 */
export const pagesAtom = atom<PagesMap, [pages: PagesMap], void>({}, () => {});

/**
 * Custom write function for 'selectedPageAtom'.
 */
selectedPageAtom.write = (get, set, id) => {
  const pages = get(pagesAtom);

  if (id === null || id in pages) {
    set(selectedPageAtom, id);
  }

  // Marking the IDs of page parents up to the root level as expanded.
  if (id !== null) {
    let page = pages[id];
    const breadcrumbs = new Set();

    while (page && page.level >= 0) {
      if (breadcrumbs.has(page.id)) {
        // Preventing looping.
        console.warn('Recurring parent', page.id);
        break;
      }

      breadcrumbs.add(page.id);
      set(updateExpandedByIdAtom, page.id, true);
      page = pages[page.parentId];
    }
  }
};

/**
 * Custom write function for 'updateExpandedByIdAtom'.
 */
updateExpandedByIdAtom.write = (get, set, id, isExpanded) => {
  const expanded = new Set(get(expandedIdsAtom));

  if (isExpanded) {
    expanded.add(id);
  } else {
    expanded.delete(id);
  }

  set(expandedIdsAtom, expanded);
};

/**
 * Custom write function for 'pagesAtom'.
 */
pagesAtom.write = (get, set, pages: PagesMap) => {
  const selected = get(selectedPageAtom);
  const expanded = get(expandedIdsAtom);

  // If the currently selected page ID is not present in the new 'pages' map, set the 'selectedPage' to null.
  if (selected && !(selected in pages)) {
    set(selectedPageAtom, null);
  }

  // Remove any expanded page IDs from the 'expandedIds' that are not present in the new 'pages' map.
  expanded.forEach((id) => {
    if (!(id in pages)) {
      expanded.delete(id);
      set(expandedIdsAtom, expanded);
    }
  });

  set(pagesAtom, pages);
};
