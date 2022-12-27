import Jwt from "jsonwebtoken";

export function auth(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.sendRes(401, "Access denied. No token provided");
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.sendRes(401, "Invalid token");
  }
}
