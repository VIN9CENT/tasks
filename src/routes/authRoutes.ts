import { Router, Request, Response } from "express";
import { register } from "../controllers/authController";
import { insertUserSchema, loginSchema } from "../db/schema";
import { validateBody } from "../middleware/validation";
import { login } from "../controllers/authController";

const router = Router();

router.post("/register", validateBody(insertUserSchema), register);

router.post("/login", validateBody(loginSchema), login);

export default router;
