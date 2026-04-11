import { Request, Response } from "express";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.query.users.findMany();
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const userWithTasks = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
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
