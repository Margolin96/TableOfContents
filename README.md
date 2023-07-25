# Table of Contents Component

## Installation

Before running the TOC component or any associated parts, make sure to install the required dependencies. You can do this by navigating to the relevant directories (`/` - repository root, `/server`) and running the following command:

```bash
npm install
```

## Getting Started

To start the local web server, follow these steps:

1. Navigate to the `server` directory:

```bash
cd server
```

2. Run the development server:

```bash
npm run dev
```

This will start the local web server, allowing you to serve the TOC component and other related content, and provide TOC contents through the API.

To run the demo project with the TOC component, use the following command:

```bash
npm start
```

This will launch the demo project, showcasing the functionality of the TOC component.

## Available Endpoints

The following endpoints are available for interacting with the TOC data through the API:

`GET /topLevelIds`: Retrieves the top-level IDs from the TOC data.

`GET /entities`: Retrieves all entities, including pages and anchors, from the TOC data.

`GET /entities/pages`: Retrieves all pages from the TOC data.

`GET /entities/pages/:id`: Retrieves a specific page by its ID from the TOC data. Replace :id with the desired page ID.

`GET /entities/pages/:id/anchors`: Retrieves a list of anchors for a specific page by its ID from the TOC data. Replace :id with the desired page ID.

`GET /entities/anchors`: Retrieves all anchors from the TOC data.

`GET /entities/anchors/:id`: Retrieves a specific anchor by its ID from the TOC data. Replace :id with the desired anchor ID.

Please note that these endpoints are set up with a 1-second delay for all incoming requests, and the server is listening on the port specified by the environment variable **PORT** or **3001** by default.

## Interfaces

The TOC component can be customized using the following properties:

```typescript
interface TOCProps {
  /**
   * Indicates whether the TOC (table of contents) data is currently being loaded.
   */
  isLoading: Boolean;

  /**
   * Indicates whether an error occurred while loading the TOC data.
   */
  isError: Boolean;

  /**
   * Indicates whether a search functionality is available in the TOC.
   */
  hasSearch?: Boolean;

  /**
   * The ID of the selected page in the TOC.
   */
  selectedId?: PageId | null;

  /**
   * A map containing the data of all pages in the TOC.
   */
  pages: PagesMap;

  /**
   * An array of top-level page IDs in the TOC.
   */
  topLevelIds: PageId[];

  /**
   * A function to handle the change of the selected page in the TOC.
   * @param {PageId | null} pageId - The ID of the selected page or null if no page is selected.
   */
  onPageSelect?: (pageId: PageId | null) => void;

  /**
   * A function to handle the change of the selected page in the TOC.
   * @param {AnchorId | null} anchorId - The ID of the selected page or null if no page is selected.
   */
  onAnchorSelect?: (anchorId: AnchorId | null) => void;
}
```

## Tests

The TOC component comes with functional tests to ensure its proper functioning. To run the tests, use the following command at the root of the repository:

```bash
npm test
```

These tests will validate the different features and functionalities of the TOC component and ensure that it behaves as expected.
