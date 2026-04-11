import { Router } from "express";
import * as userController from "../controllers/userController";
import { validateBody, validateParams } from "../middleware/validation";
import { idSchema, updateUserSchema } from "../db/schema";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.use(authenticateToken)
router.get("/", userController.getAllUsers);

router.get("/:id", validateParams(idSchema),userController.getUserTasks );


router.patch(
  "/:id",
  validateParams(idSchema),
  validateBody(updateUserSchema),
  userController.updateUser,
);
router.put(
  "/:id",
  validateParams(idSchema),
  validateBody(updateUserSchema),
  userController.updateUser,
);

router.delete("/:id", validateParams(idSchema), userController.deleteUser);

export default router;
