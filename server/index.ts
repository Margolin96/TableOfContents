import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

import type {
  Anchor,
  AnchorsMap,
  PageId,
  PagesMap,
} from '../src/types';

dotenv.config();

/**
 * Express application instance
 * @type {Express}
 */
const app: Express = express();

/**
 * Port for the server to listen on
 * @type {number|string}
 */
const port = process.env.PORT || 3001;

/**
 * Path to the JSON file
 * @type {string}
 */
const json_path = `${__dirname}/${process.env.JSON_PATH || 'toc.json'}`;

/**
 * Data object obtained from the JSON file
 */
const data: {
  entities: {
    pages: PagesMap;
    anchors: AnchorsMap;
  };
  topLevelIds: PageId[];
} = require(json_path);

/**
 * Enabling CORS for the app.
 */
app.use(cors());

/**
 * Adds a 2-second delay to all incoming requests.
 */
app.all('*', (req, res, next) => {
  setTimeout(() => {
    next();
  }, 500);
});


/**
 * Start the server
 */
app.listen(port, () => {
  console.info(`Server is running at http://localhost:${port}`);
});

/**
 * Route to get the top level IDs
 */
app.get('/topLevelIds', (req: Request, res: Response) => {
  res.end( JSON.stringify(data.topLevelIds, null, 2) );
});

/**
 * Route to get all entities
 */
app.get('/entities', (req: Request, res: Response) => {
  res.end( JSON.stringify(data, null, 2) );
});

/**
 * Route to get all pages
 */
app.get('/entities/pages', (req: Request, res: Response) => {
  res.end( JSON.stringify(data.entities.pages, null, 2) );
});

/**
 * Route to get a specific page by ID
 * @param {PageId} req.params.id - Requested page ID
 */
app.get('/entities/pages/:id', (req: Request, res: Response) => {
  res.end( JSON.stringify(data.entities.pages[req.params.id], null, 2) );
});

/**
 * Route to get a list of anchors for a specific page by ID
 * @param {PageId} req.params.id - Requested page ID
 */
app.get('/entities/pages/:id/anchors', (req: Request, res: Response) => {
  const anchors: Anchor[] = [];

  data.entities.pages[req.params.id]?.anchors?.forEach((anchorId) => {
    if (data.entities?.anchors[anchorId]) {
      anchors.push(data.entities.anchors[anchorId]);
    }
  });

  res.end( JSON.stringify(anchors, null, 2) );
});

/**
 * Route to get all anchors
 */
app.get('/entities/anchors', (req: Request, res: Response) => {
  res.end( JSON.stringify(data.entities.anchors, null, 2) );
});

/**
 * Route to get a specific anchor by ID
 * @param {AnchorId} req.params.id - Requested anchor ID
 */
app.get('/entities/anchors/:id', (req: Request, res: Response) => {
  res.end( JSON.stringify(data.entities.anchors[req.params.id], null, 2) );
});
