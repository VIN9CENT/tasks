import { Router } from "express";
import * as taskController from "../controllers/taskController";
import { validateBody, validateParams } from "../middleware/validation";
import { insertTaskSchema, taskIdSchema, updateTaskSchema } from "../db/schema";
import { authenticateToken, authorizeAdmin } from "../middleware/auth";

const router = Router();

// user routes — any logged-in user
router.get("/me", authenticateToken, taskController.getMyTasks);
router.post("/", authenticateToken, validateBody(insertTaskSchema), taskController.createTask);
router.patch(
  "/:id",
  authenticateToken,
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  taskController.updateTask,
);
router.put(
  "/:id",
  authenticateToken,
  validateParams(taskIdSchema),
  validateBody(insertTaskSchema),
  taskController.replaceTask,
);
router.delete("/:id", authenticateToken, validateParams(taskIdSchema), taskController.deleteTask);

// admin routes — token + admin role required
router.get("/", authenticateToken, authorizeAdmin, taskController.getAllTasks);
router.get("/:id", authenticateToken, authorizeAdmin, validateParams(taskIdSchema), taskController.getTaskById);
router.delete("/:id/force", authenticateToken, authorizeAdmin, validateParams(taskIdSchema), taskController.adminDeleteTask);


// user — manage tags on their own tasks
router.post("/:taskId/tags/:tagId", authenticateToken, taskController.addTagToTask);
router.delete("/:taskId/tags/:tagId", authenticateToken, taskController.removeTagFromTask);

export default router;