"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteTask = exports.deleteTask = exports.replaceTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getMyTasks = exports.getAllTasks = void 0;
const connection_1 = require("../db/connection");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
// ADMIN: get all tasks across all users
const getAllTasks = async (req, res) => {
    try {
        const task_list = await connection_1.db.query.tasks.findMany({
            with: { taskTags: { with: { tag: true } } },
        });
        res.status(200).json(task_list);
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};
exports.getAllTasks = getAllTasks;
// USER: get only their own tasks
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const myTasks = await connection_1.db.query.tasks.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.tasks.userId, userId),
            with: { taskTags: { with: { tag: true } } },
        });
        res.status(200).json(myTasks);
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};
exports.getMyTasks = getMyTasks;
// ADMIN: get any task by id
const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await connection_1.db.query.tasks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.tasks.id, id),
            with: { taskTags: { with: { tag: true } } },
        });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        res.status(200).json(task);
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getTaskById = getTaskById;
// USER: create task — userId always from token, never from body
const createTask = async (req, res) => {
    const userId = req.user?.id;
    const { summary, details } = req.body;
    try {
        const [newTask] = await connection_1.db
            .insert(schema_1.tasks)
            .values({
            summary,
            details,
            userId: userId, // ← forced from token
            completed: false,
        })
            .returning();
        res.status(201).json(newTask);
    }
    catch (e) {
        res.status(500).json({ error: "Could not create task" });
    }
};
exports.createTask = createTask;
// USER: update only their own task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const { summary, details, completed } = req.body;
    try {
        const task = await connection_1.db.query.tasks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.tasks.id, id),
        });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        if (task.userId !== userId)
            return res.status(403).json({ message: "Not your task" }); // ← ownership check
        const [updatedTask] = await connection_1.db
            .update(schema_1.tasks)
            .set({
            ...(summary !== undefined && { summary }),
            ...(details !== undefined && { details }),
            ...(completed !== undefined && { completed }),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id))
            .returning();
        res.json(updatedTask);
    }
    catch (e) {
        res.status(500).json({ error: "Update failed" });
    }
};
exports.updateTask = updateTask;
// USER: replace only their own task
const replaceTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    try {
        const task = await connection_1.db.query.tasks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.tasks.id, id),
        });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        if (task.userId !== userId)
            return res.status(403).json({ message: "Not your task" }); // ← ownership check
        const [updatedTask] = await connection_1.db
            .update(schema_1.tasks)
            .set(req.body)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id))
            .returning();
        res.json(updatedTask);
    }
    catch (e) {
        res.status(500).json({ error: "Full update failed" });
    }
};
exports.replaceTask = replaceTask;
// USER: delete only their own task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    try {
        const task = await connection_1.db.query.tasks.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.tasks.id, id),
        });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        if (task.userId !== userId)
            return res.status(403).json({ message: "Not your task" }); // ← ownership check
        const [deletedTask] = await connection_1.db
            .delete(schema_1.tasks)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id))
            .returning();
        res
            .status(200)
            .json({ message: "Task deleted successfully", task: deletedTask });
    }
    catch (e) {
        res.status(500).json({ error: "Delete failed" });
    }
};
exports.deleteTask = deleteTask;
// ADMIN: force delete any task regardless of owner
const adminDeleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const [deletedTask] = await connection_1.db
            .delete(schema_1.tasks)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id))
            .returning();
        if (!deletedTask)
            return res.status(404).json({ message: "Task not found" });
        res
            .status(200)
            .json({ message: "Task deleted successfully", task: deletedTask });
    }
    catch (e) {
        res.status(500).json({ error: "Delete failed" });
    }
};
exports.adminDeleteTask = adminDeleteTask;
//# sourceMappingURL=taskController.js.map