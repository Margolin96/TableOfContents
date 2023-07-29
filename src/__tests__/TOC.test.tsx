import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TOC } from '../components/TOC';
import { Anchor, PagesMap } from '../types/types';

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
  page1: { id: 'page1', title: 'Page 1', level: 0, parentId: '', pages: [ 'page3' ] },
  page2: { id: 'page2', title: 'Page 2', level: 0, parentId: '', anchors: [ 'anchor1' ] },
  page3: { id: 'page3', title: 'page 3', level: 1, parentId: 'page1' },
};
const page2anchors: Anchor[] = [
  { id: 'anchor1', title: 'Anchor 1', url: '', anchor: '', level: 0 },
];
const topLevelIds = ['page1', 'page2'];

describe('TOC', () => {
  it('should render loading placeholder when isLoading is true', () => {
    render(
      <TOC
        isError={false}
        isLoading={true}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );
    
    expect(screen.getAllByTestId('placeholder')).toHaveLength(10);
  });

  it('should render error message when isError is true', () => {
    render(
      <TOC
        isError={true}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    expect(screen.getByText(/unable to load table of contents/i)).toBeInTheDocument();
  });

  it('should render TOC items when isLoading and isError are false', () => {
    render(
      <TOC
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

  it('should scroll into view the selected page', async () => {
    FakeScrollIntoView.mockReset();

    render(
      <TOC
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

  it('should expand and collapse subtree when page is clicked', async () => {
    render(
      <TOC
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    expect(screen.queryByText(/page 3/i)).toBeNull();

    await act(async () => {
      userEvent.click(screen.getByText(/page 1/i));
      await delay(100);
    });

    expect(screen.getByText(/page 3/i)).toBeInTheDocument();

    await act(async () => {
      userEvent.click(screen.getByText(/page 1/i));
      await delay(100);
    });

    expect(screen.queryByText(/page 3/i)).toBeNull();
  });

  it('should call onPageSelect callback passing a currently selected page ID', async () => {
    const onPageSelectMock = jest.fn();

    const { rerender } = render(
      <TOC
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

    rerender(
      <TOC
        isError={false}
        isLoading={false}
        pages={pages}
        selectedId={'page2'}
        topLevelIds={topLevelIds}
        onPageSelect={onPageSelectMock}
      />
    )

    expect(onPageSelectMock).toHaveBeenCalledWith('page2');
  });
});

describe('TOC - Anchors', () => {
  it('should expand a list of anchors when page is selected', async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({ json: () => Promise.resolve(page2anchors) })
    }) as any;

    render(
      <TOC
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    expect(screen.queryByText(/anchor 1/i)).toBeNull();

    await act(async () => {
      await userEvent.click(screen.getByText(/page 2/i));
      await delay(100);
    });

    expect(screen.getByText(/anchor 1/i)).toBeInTheDocument();
  });

  it('should call onAnchorSelect callback passing a currently selected anchor ID', async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({ json: () => Promise.resolve(page2anchors) })
    }) as any;

    const onAnchorSelectMock = jest.fn();

    render(
      <TOC
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
        onAnchorSelect={onAnchorSelectMock}
      />
    );

    await act(async () => {
      userEvent.click(screen.getByText(/page 2/i));
      await delay(200);
    });

    await act(async () => {
      userEvent.click(screen.getByText(/anchor 1/i));
      await delay(200);
    });

    expect(onAnchorSelectMock).toHaveBeenCalledWith('anchor1');
  });
});

describe('TOC - Search', () => {
  const SEARCH_DEBOUNCE_DELAY = 500;

  it('should render search field only when hasSearch is true', () => {
    const { rerender } = render(
      <TOC
        isError={false}
        isLoading={false}
        pages={pages}
        topLevelIds={topLevelIds}
      />
    );

    expect(screen.queryByRole('searchbox')).toBeNull();

    rerender(
      <TOC
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
      <TOC
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
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Page 2/i)).toBeInTheDocument();

    // Wait for a short time more than the debounce delay
    await act(() => delay(200));

    // Expect pages to be filtered after the debounce delay
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Page 2/i)).toBeNull();
  });

  it('should filter pages case-insensitively', async () => {
    render(
      <TOC
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
