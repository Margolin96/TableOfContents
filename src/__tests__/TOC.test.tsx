import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { useAtomValue } from 'jotai';

import { TOCWrapper } from '../components/TOC';
import { selectedPageAtom } from '../store/store';
import { PagesMap } from '../types/types';

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Mocking necessary components and functions
jest.mock('../components/Placeholder', () => ({
  Placeholder: () => <div data-testid="placeholder"></div>,
}));

// Mock the scrollIntoView function since we are not testing the browser's scroll behavior
const FakeScrollIntoView = jest.fn();

Element.prototype.scrollIntoView = FakeScrollIntoView;

const pages: PagesMap = {
  page1: {
    id: 'page1', title: 'Page 1',
    level: 0,
    parentId: ''
  },
  page2: {
    id: 'page2', title: 'Page 2',
    level: 0,
    parentId: ''
  },
  page3: {
    id: 'page3', title: 'page 3',
    level: 1,
    parentId: 'page1'
  },
  page4: {
    id: 'page4', title: 'page 4',
    level: 1,
    parentId: 'page1'
  },
};
const topLevelIds = ['page1', 'page2'];

describe('TOCWrapper', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render loading placeholder when isLoading is true', () => {
    render(<TOCWrapper {...{
      isLoading: true,
      isError: false,
      pages,
      topLevelIds,
    }} />);
    
    expect(screen.getAllByTestId('placeholder')).toHaveLength(10);
  });

  it('should render error message when isError is true', () => {
    render(<TOCWrapper {...{
      isLoading: false,
      isError: true,
      pages,
      topLevelIds,
    }} />);

    expect(screen.getByText(/unable to load table of contents/i)).toBeInTheDocument();
  });

  it('should render TOC items when isLoading and isError are false', () => {
    render(
      <TOCWrapper
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    for (const pageId in pages) {
      const page = pages[pageId];

      if (page.level === 0) {
        expect(screen.getByText(page.title)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(page.title)).toBeNull();
      }
    }
  });

  it('should call onPageSelect callback passing a currently selected page ID', async () => {
    const onPageSelectMock = jest.fn();

    render(
      <TOCWrapper
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
        onPageSelect={onPageSelectMock}
      />
    );

    await act(async () => {
      userEvent.click(screen.getByText(/page 1/i));
      await delay(100);
    });

    expect(onPageSelectMock).toHaveBeenCalledWith('page1');
  });

  it('should scroll into view the selected page', async () => {
    FakeScrollIntoView.mockReset();

    render(
      <TOCWrapper
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    await act(async () => {
      userEvent.click(screen.getByText(/page 1/i));
      await delay(100);
    });

    expect(FakeScrollIntoView).toHaveBeenCalled();
  });

  it('should update the selected page ID when selectedId prop changes', () => {
    const { rerender } = render(
      <TOCWrapper
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    const selectedPage = renderHook(() => useAtomValue(selectedPageAtom));

    expect(selectedPage.result.current).toBeNull();

    // Rerender with passing selectedId
    rerender(
      <TOCWrapper
        isError={false}
        isLoading={false}
        pages={pages}
        selectedId="page1"
        topLevelIds={topLevelIds}
      />
    );

    const updatedSelectedPage = renderHook(() => useAtomValue(selectedPageAtom));

    expect(updatedSelectedPage.result.current).toBe('page1');

    // Rerender with a different selectedId
    rerender(
      <TOCWrapper
        isError={false}
        isLoading={false}
        pages={pages}
        selectedId="page2"
        topLevelIds={topLevelIds}
      />
    );

    const updatedSelectedPage2 = renderHook(() => useAtomValue(selectedPageAtom));
    
    expect(updatedSelectedPage2.result.current).toBe('page2');
  });
});

describe('TOCWrapper - Search Functionality', () => {
  afterEach(() => {
    cleanup();
  });

  const SEARCH_DEBOUNCE_DELAY = 500;

  it('should render search field only when hasSearch is true', () => {
    const { rerender } = render(
      <TOCWrapper
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    expect(screen.queryByRole('searchbox')).toBeNull();

    rerender(
      <TOCWrapper
        hasSearch={true}
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should not filter pages immediately when query is provided', async () => {
    render(
      <TOCWrapper
        hasSearch={true}
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    // Should not be affected immediately
    userEvent.type(screen.getByRole('searchbox'), 'Page 1');

    // Wait for a short time less than the debounce delay
    await act(() => delay(SEARCH_DEBOUNCE_DELAY - 100));

    // Expect pages to be unaffected after a short time
    expect(screen.getByText(/page 1/i)).toBeInTheDocument();
    expect(screen.getByText(/page 2/i)).toBeInTheDocument();

    // Wait for a short time more than the debounce delay
    await act(() => delay(200));

    // Expect pages to be filtered after the debounce delay
    expect(screen.getByText(/page 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/page 2/i)).toBeNull();
  });

  it('should filter pages case-insensitively', async () => {
    render(
      <TOCWrapper
        hasSearch={true}
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    // Case sensitivity check
    await act(async () => {
      userEvent.type(screen.getByRole('searchbox'), 'page 1');
      await delay(SEARCH_DEBOUNCE_DELAY + 100);
    });

    expect(screen.getByText(/page 1/i)).toBeInTheDocument();
  });
});
