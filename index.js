import "./startup/logging.js";
import "./startup/db.js";
import "./startup/validation.js";
import routeConfig from "./startup/routes.js";
import express from "express";
import helmet from "helmet";
import winston from "winston";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
routeConfig(app);

app.listen(PORT, 'localhost', () => winston.info(`Server running on port ${PORT}`));
