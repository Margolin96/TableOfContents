import useSWR from "swr"
import { Page, PageId, PagesMap } from "../types"

const API_URL = 'http://localhost:3001';

const swrConfig = {};

export const usePages = () => {
  return useSWR(
    `/pages`,
    (): Promise<PagesMap> => fetch(`${API_URL}/entities/pages`).then(r => r.json()),
    swrConfig
  );
};

export const usePage = (id: PageId) => {
  return useSWR(
    `/pages/${id}`,
    (): Promise<Page> => fetch(`${API_URL}/entities/pages/${id}`).then(r => r.json()),
    { refreshInterval: 0 }
  );
};

export const useTopLevelIds = () => {
  return useSWR(
    '/topLevelIds',
    (): Promise<PageId[]> => fetch(`${API_URL}/topLevelIds`).then(r => r.json()),
    swrConfig
  );
};
