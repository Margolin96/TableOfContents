import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

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
 * @type {any}
 */
const data = require(json_path);

/**
 * TODO: add comment
 */
app.use(cors());

/**
 * Start the server
 */
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
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
