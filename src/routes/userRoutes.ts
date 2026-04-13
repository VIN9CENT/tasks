import { Router } from "express";
import * as userController from "../controllers/userController";
import { validateBody, validateParams } from "../middleware/validation";
import { idSchema, updateUserSchema } from "../db/schema";
import { authenticateToken, authorizeAdmin } from "../middleware/auth";

const router = Router();

// user routes — any logged-in user
router.get("/me", authenticateToken, userController.getMe);
router.get("/me/tasks", authenticateToken, userController.getMyTasks);

// admin routes — token + admin role required
router.get("/", authenticateToken, authorizeAdmin, userController.getAllUsers);
router.get("/:id", authenticateToken, authorizeAdmin, validateParams(idSchema), userController.getUserTasks);
router.patch(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  validateParams(idSchema),
  validateBody(updateUserSchema),
  userController.updateUser,
);
router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  validateParams(idSchema),
  validateBody(updateUserSchema),
  userController.updateUser,
);
router.delete("/:id", authenticateToken, authorizeAdmin, validateParams(idSchema), userController.deleteUser);

export default router;