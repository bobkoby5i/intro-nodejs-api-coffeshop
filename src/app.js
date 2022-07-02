import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import morgan from 'morgan';
// import readFile  from "fs";
// import path from "path";
// import fs from 'fs';
// import debug from 'debug';

// const debugApp = debug('app');

import { APP_PORT } from './config/app';
import api from './api';

(async function runApp() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // app.use(express.json({extended: false})); // tu use with json
  // app.use(express.urlencoded({ extended: true })); // to use with x-www-form-urlencoded.
  console.log('Hello World!');

  // Add routing
  app.use(api);

  const server = app.listen(APP_PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });

  // app.listen(APP_PORT, function server() {
  //    console.log(`Listening on port ${APP_PORT}`);
  // });
})();
