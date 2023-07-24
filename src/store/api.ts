import useSWR from "swr";

import { Anchor, Page, PageId } from "../types";

const API_URL = 'http://localhost:3001';

const swrConfig = {};

/**
 * Hook to fetch all pages map.
 */
export const usePages = () => {
  return useSWR(
    `/pages`,
    (): Promise<Record<PageId, Page>> => fetch(`${API_URL}/entities/pages`).then(r => r.json()),
    swrConfig
  );
};

/**
 * Hook to fetch anchors for a specific page ID.
 * @param {PageId} id - The ID of the page for which anchors are fetched.
 */
export const usePageAnchors = (id: PageId) => {
  return useSWR(
    `/anchors/${id}`,
    (): Promise<Anchor[]> => fetch(`${API_URL}/entities/pages/${id}/anchors`).then(r => r.json()),
    swrConfig
  );
};

/**
 * Hook to fetch the top-level page IDs.
 */
export const useTopLevelIds = () => {
  return useSWR(
    '/topLevelIds',
    (): Promise<PageId[]> => fetch(`${API_URL}/topLevelIds`).then(r => r.json()),
    swrConfig
  );
};
