import winston from "winston";

export default function (err, req, res, next) {
  winston.error("", err);
  res.sendRes(500, "Something failed.");
}
