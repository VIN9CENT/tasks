"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserTasks = exports.getMyTasks = exports.getMe = exports.getAllUsers = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await connection_1.db.query.users.findMany();
        res.status(200).json(allUsers);
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
//get only the logged-in user's profile
const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await connection_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId),
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getMe = getMe;
//  get only the logged-in user's tasks
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userWithTasks = await connection_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId),
            with: {
                tasks: { with: { taskTags: { with: { tag: true } } } },
            },
        });
        if (!userWithTasks)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(userWithTasks);
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getMyTasks = getMyTasks;
const getUserTasks = async (req, res) => {
    const { id } = req.params;
    try {
        const userWithTasks = await connection_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, id),
            with: {
                tasks: { with: { taskTags: { with: { tag: true } } } },
            },
        });
        if (!userWithTasks)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(userWithTasks);
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getUserTasks = getUserTasks;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const [updated] = await connection_1.db
        .update(schema_1.users)
        .set(req.body)
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
        .returning();
    if (!updated)
        return res.status(404).json({ message: "User not found" });
    res.json(updated);
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const [deleted] = await connection_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).returning();
    if (!deleted)
        return res.status(404).json({ message: "User not found" });
    res.json({ message: "User and all their tasks deleted" });
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map