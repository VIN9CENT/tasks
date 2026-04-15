import { Request, Response } from "express";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth";


export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allUsers = await db.query.users.findMany({
      columns: {
        password: false,
      },
    });
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
//get only the logged-in user's profile
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId!),
      columns: {
        password: false,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

//  get only the logged-in user's tasks
export const getMyTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const userWithTasks = await db.query.users.findFirst({
      where: eq(users.id, userId!),
      with: {
        tasks: { with: { taskTags: { with: { tag: true } } } },
      },
    });

    if (!userWithTasks)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(userWithTasks);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const userWithTasks = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        tasks: { with: { taskTags: { with: { tag: true } } } },
      },
    });

    if (!userWithTasks)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(userWithTasks);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const [updated] = await db
    .update(users)
    .set(req.body)
    .where(eq(users.id, id))
    .returning();
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
  if (!deleted) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User and all their tasks deleted" });
};
