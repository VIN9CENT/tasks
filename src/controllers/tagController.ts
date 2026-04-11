import { Request, Response } from "express";
import { db } from "../db/connection";
import { tags } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAllTags = async (_req: Request, res: Response) => {
  const tagList = await db.query.tags.findMany();
  res.json(tagList);
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const tag = await db.query.tags.findFirst({
      where: eq(tags.id, id),
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json(tag);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving tag" });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { id, name, color } = req.body;

    const newTag = await db
      .insert(tags)
      .values({
        id,
        name,
        color,
      })
      .returning();

    res.status(201).json(newTag[0]);
  } catch (e) {
    console.log(e);
  }
};

export const updateTagById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const updatedTag = await db
      .update(tags)
      .set({
        ...req.body,
      })
      .where(eq(tags.id, id))
      .returning();

    if (updatedTag.length === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json(updatedTag[0]);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error updating tag" });
  }
};
export const patchTagById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { id: newId, name, color } = req.body;

    const updatedTag = await db
      .update(tags)
      .set({
        ...(newId !== undefined && { id: newId }),
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
      })
      .where(eq(tags.id, id))
      .returning();

    if (updatedTag.length === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json(updatedTag[0]);
  } catch (e) {
    console.log(e);
  }
};

export const deleteTagById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const deletedTag = await db.delete(tags).where(eq(tags.id, id)).returning();

    if (deletedTag.length === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag deleted", tag: deletedTag[0] });
  } catch (e) {
    console.log(e);
  }
};
