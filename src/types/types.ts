export type PageId = string;
export type AnchorId = string;

export interface Page {
  id: PageId; // – unique element identification number
  title: string; // – page title, used as a text for TOC link
  url?: string; // – relative path to a page, href for a link
  level: number; // – element nesting level in regards to the root. level determines inner margin in the node
  parentId: PageId | null; // – parent id pointer used to determine where to nest the element 
  pages?: PageId[]; // – list of nested pages ids
  anchors?: AnchorId[]; // – list of anchor ids that are to be rendered when element is activated 
  tabIndex?: number; // – ignore
  disqus_id?: string; // – ignore
}

export interface Anchor {
  id: AnchorId; // – unique element identification number
  title: string; // – anchor title, used as a text for TOC link
  url: string; // – path to the page related to the anchor
  anchor: string; // – anchor itself presented as `#anchor-name`. href for a link is created using url and anchor 
  level: number; // – element nesting level in regards to the root. level determines inner margin in the node
  disqus_id?: string; // – ignore
}

export type PagesMap = Record<PageId, Page>;
export type AnchorsMap = Record<AnchorId, Anchor>;
