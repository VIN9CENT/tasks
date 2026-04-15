import { Router} from "express";
import { register, login } from "../controllers/authController";
import { insertUserSchema, loginSchema } from "../db/schema";
import { validateBody } from "../middleware/validation";

const router = Router();

router.post("/register", validateBody(insertUserSchema), register);

router.post("/login", validateBody(loginSchema), login);

export default router;