import express, { Request, Response } from "express";
import { db } from "./db/connection";
import { eq } from "drizzle-orm";
import { tasks } from "./db/schema";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. GET ALL
app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const task_list = await db.query.tasks.findMany({
      with: { taskTags: { with: { tag: true } } },
    });
    res.status(200).json(task_list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 2. GET BY ID
app.get("/tasks/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  try {
    const task = await db.query.tasks.findFirst({
      where: (tasks, { eq }) => eq(tasks.id, taskId),
      with: { taskTags: { with: { tag: true } } },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. POST (Create)
app.post("/tasks", async (req: Request, res: Response) => {
  const { summary, details, userId } = req.body;

  try {
    const [newTask] = await db
      .insert(tasks)
      .values({
        summary,
        details,
        userId,
        completed: false,
      })
      .returning();

    res.status(201).json(newTask);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: "Could not create task. Ensure userId is a valid UUID." });
  }
});

// 4. PUT (Full Update) & 5. PATCH (Partial Update)

app.patch("/tasks/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  const { summary, details, completed } = req.body;

  try {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...(summary !== undefined && { summary }),
        ...(details !== undefined && { details }),
        ...(completed !== undefined && { completed }),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 6. DELETE
app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id as string;

  try {
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning();

    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: `Task deleted successfully` });
  } catch (e) {
    res.status(500).json({ error: "Delete failed" });
  }
});

//GET USERS

app.get("/users", async (req: Request, res: Response) => {
  try {
    const allUsers = await db.query.users.findMany();

    res.status(200).json(allUsers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//GET USER BY ID + TASKS
app.get("/users/:id/tasks", async (req: Request, res: Response) => {
  const userId = req.params.id as string;

  try {
    const userWithTasks = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: {
        tasks: {
          with: {
            taskTags: {
              with: {
                tag: true,
              },
            },
          },
        },
      },
    });

    if (!userWithTasks) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userWithTasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
