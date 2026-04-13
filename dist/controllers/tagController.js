"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTagById = exports.patchTagById = exports.updateTagById = exports.createTag = exports.getTagById = exports.getAllTags = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getAllTags = async (_req, res) => {
    const tagList = await connection_1.db.query.tags.findMany();
    res.json(tagList);
};
exports.getAllTags = getAllTags;
const getTagById = async (req, res) => {
    try {
        const id = req.params.id;
        const tag = await connection_1.db.query.tags.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.tags.id, id),
        });
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.status(200).json(tag);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error retrieving tag" });
    }
};
exports.getTagById = getTagById;
const createTag = async (req, res) => {
    try {
        const { id, name, color } = req.body;
        const newTag = await connection_1.db
            .insert(schema_1.tags)
            .values({
            id,
            name,
            color,
        })
            .returning();
        res.status(201).json(newTag[0]);
    }
    catch (e) {
        console.log(e);
    }
};
exports.createTag = createTag;
const updateTagById = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTag = await connection_1.db
            .update(schema_1.tags)
            .set({
            ...req.body,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.tags.id, id))
            .returning();
        if (updatedTag.length === 0) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.json(updatedTag[0]);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error updating tag" });
    }
};
exports.updateTagById = updateTagById;
const patchTagById = async (req, res) => {
    try {
        const id = req.params.id;
        const { id: newId, name, color } = req.body;
        const updatedTag = await connection_1.db
            .update(schema_1.tags)
            .set({
            ...(newId !== undefined && { id: newId }),
            ...(name !== undefined && { name }),
            ...(color !== undefined && { color }),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.tags.id, id))
            .returning();
        if (updatedTag.length === 0) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.json(updatedTag[0]);
    }
    catch (e) {
        console.log(e);
    }
};
exports.patchTagById = patchTagById;
const deleteTagById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTag = await connection_1.db.delete(schema_1.tags).where((0, drizzle_orm_1.eq)(schema_1.tags.id, id)).returning();
        if (deletedTag.length === 0) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.status(200).json({ message: "Tag deleted", tag: deletedTag[0] });
    }
    catch (e) {
        console.log(e);
    }
};
exports.deleteTagById = deleteTagById;
//# sourceMappingURL=tagController.js.map