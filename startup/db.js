import mongoose from "mongoose";
import winston from "winston";

(function () {
  mongoose
    .connect(process.env.DB_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("MongoDb Connection Succeeded"));
})();
