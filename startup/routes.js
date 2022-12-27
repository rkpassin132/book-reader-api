import cors from "cors";
import path from 'path';
import express from "express";
import bodyParser from "body-parser";
import sendResMiddleware from "../middleware/response.mw.js";
import errorMiddleware from "../middleware/error.mw.js";
import { auth } from "../middleware/auth.mw.js";

import indexRoutes from "../routes/index.js";
import authRoutes from "../routes/authRoutes.js";
const __dirname = path.resolve();

export default function (app) {
  app.use(cors());
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
  app.use(sendResMiddleware);

  app.use("/api/v1", indexRoutes);
  app.use("/api/v1", auth, authRoutes);
  app.use('/api/v1/public', auth, express.static(__dirname  + "/public"));

  app.use(errorMiddleware);
}
