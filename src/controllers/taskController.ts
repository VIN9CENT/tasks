import { Request, Response } from "express";
import { db } from "../db/connection";
import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";

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

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const task = await db.query.tasks.findFirst({
      where: (tasks, { eq }) => eq(tasks.id, id),
      with: { taskTags: { with: { tag: true } } },
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { summary, details, userId } = req.body;
  try {
    const [newTask] = await db.insert(tasks).values({
      summary, details, userId, completed: false,
    }).returning();
    res.status(201).json(newTask);
  } catch (e) {
    res.status(500).json({ error: "Could not create task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { summary, details, completed } = req.body;
  try {
    const [updatedTask] = await db.update(tasks).set({
      ...(summary !== undefined && { summary }),
      ...(details !== undefined && { details }),
      ...(completed !== undefined && { completed }),
    }).where(eq(tasks.id, id)).returning();

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const replaceTask = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const [updatedTask] = await db
      .update(tasks)
      .set(req.body)
      .where(eq(tasks.id, id))
      .returning();

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: "Full update failed" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const [deletedTask] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: `Task deleted successfully` });
  } catch (e) {
    res.status(500).json({ error: "Delete failed" });
  }
};