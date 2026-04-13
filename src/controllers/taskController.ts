import { Request, Response } from "express";
import { db } from "../db/connection";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { AuthenticatedRequest } from "../middleware/auth";

// ADMIN: get all tasks across all users
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const task_list = await db.query.tasks.findMany({
      with: { taskTags: { with: { tag: true } } },
    });
    res.status(200).json(task_list);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// USER: get only their own tasks
export const getMyTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const myTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId!),
      with: { taskTags: { with: { tag: true } } },
    });
    res.status(200).json(myTasks);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ADMIN: get any task by id
export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      with: { taskTags: { with: { tag: true } } },
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// USER: create task — userId always from token, never from body
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { summary, details } = req.body;
  try {
    const [newTask] = await db
      .insert(tasks)
      .values({
        summary,
        details,
        userId: userId!, // ← forced from token
        completed: false,
      })
      .returning();
    res.status(201).json(newTask);
  } catch (e) {
    res.status(500).json({ error: "Could not create task" });
  }
};

// USER: update only their own task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user?.id;
  const { summary, details, completed } = req.body;
  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId !== userId)
      return res.status(403).json({ message: "Not your task" }); // ← ownership check

    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...(summary !== undefined && { summary }),
        ...(details !== undefined && { details }),
        ...(completed !== undefined && { completed }),
      })
      .where(eq(tasks.id, id))
      .returning();

    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: "Update failed" });
  }
};

// USER: replace only their own task
export const replaceTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user?.id;
  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId !== userId)
      return res.status(403).json({ message: "Not your task" }); // ← ownership check

    const [updatedTask] = await db
      .update(tasks)
      .set(req.body)
      .where(eq(tasks.id, id))
      .returning();

    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: "Full update failed" });
  }
};

// USER: delete only their own task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user?.id;
  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.userId !== userId)
      return res.status(403).json({ message: "Not your task" }); // ← ownership check

    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (e) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// ADMIN: force delete any task regardless of owner
export const adminDeleteTask = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (e) {
    res.status(500).json({ error: "Delete failed" });
  }
};
