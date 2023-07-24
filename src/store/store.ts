import { atom } from "jotai";
import { PageId, PagesMap } from "../types";

export const selectedPageAtom = atom<PageId | null, [id: PageId | null], void>(null, (get, set, id) => {
  const pages = get(pagesAtom);

  if (id === null || id in pages) {
    set(selectedPageAtom, id);
  }

  if (id !== null) {
    let page = pages[id];
    const breadcrumbs = new Set();

    while(page && page.level >= 0) {
      if (breadcrumbs.has(page.id)) {
        // Preventing looping
        console.warn('Recurring parent', page.id);
        break;
      }

      breadcrumbs.add(page.id);
      set(updateExpandedByIdAtom, page.id, true);
      page = pages[page.parentId];
    }
  }
});

export const expandedIdsAtom = atom(new Set<PageId>());
export const updateExpandedByIdAtom = atom<null, [id: PageId, isExpanded: Boolean], void>(null, (get, set, id, isExpanded) => {
  const expanded = new Set(get(expandedIdsAtom));

  if (isExpanded) {
    expanded.add(id);
  } else {
    expanded.delete(id);
  }

  set(expandedIdsAtom, expanded);
});

export const pagesAtom = atom<PagesMap, [pages: PagesMap], void>({}, (get, set, pages: PagesMap) => {
  const selected = get(selectedPageAtom);
  const expanded = get(expandedIdsAtom);

  if (selected && !(selected in pages)) {
    set(selectedPageAtom, null);
  }

  expanded.forEach((id) => {
    if (!(id in pages)) {
      expanded.delete(id);
      set(expandedIdsAtom, expanded);
    }
  });

  set(pagesAtom, pages);
});
