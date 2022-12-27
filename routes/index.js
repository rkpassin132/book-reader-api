import express from "express";
import { ping, update } from "../controllers/app.controller.js";
import { login, loginForMe } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/ping", ping);
router.post("/update", update);

router.post("/auth/login", login);
router.post("/auth/login-for-me", loginForMe);

export default router;
