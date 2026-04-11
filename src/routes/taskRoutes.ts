import { Router } from "express";
import * as taskController from "../controllers/taskController";
import { validateBody, validateParams } from "../middleware/validation";
import { insertTaskSchema, taskIdSchema,updateTaskSchema} from "../db/schema";
import { authenticateToken } from "../middleware/auth";


const router = Router();

router.use(authenticateToken)
// GET /tasks
router.get("/", taskController.getAllTasks);
// GET /tasks/:id
router.get("/:id", validateParams(taskIdSchema), taskController.getTaskById);

// POST /tasks
router.post("/", validateBody(insertTaskSchema), taskController.createTask);

// PATCH /tasks/:id
router.patch(
  "/:id",
    validateParams(taskIdSchema),
    validateBody(updateTaskSchema),
  taskController.updateTask,
);

//Delete task
router.delete("/:id", validateParams(taskIdSchema), taskController.deleteTask);
export default router;
//replace task - PUT /tasks/:id
router.put(
  "/:id",
  validateParams(taskIdSchema),
  validateBody(insertTaskSchema),
  taskController.replaceTask,
);