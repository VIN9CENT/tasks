"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const drizzle_orm_1 = require("drizzle-orm");
const password_2 = require("../utils/password");
const register = async (req, res) => {
    try {
        const { age, email, name, password, role } = req.body;
        // Basic validation
        if (typeof age !== "number" ||
            typeof email !== "string" ||
            typeof name !== "string" ||
            typeof password !== "string") {
            return res
                .status(400)
                .json({ message: "Missing or invalid fields in request body" });
        }
        // hash password
        const hashedPassword = await (0, password_1.hashPassword)(password);
        //create user
        const [newUser] = await connection_1.db
            .insert(schema_1.users)
            .values({
            name,
            email,
            age,
            role: (role ?? "user"),
            password: hashedPassword,
        })
            .returning({
            id: schema_1.users.id,
            name: schema_1.users.name,
            email: schema_1.users.email,
            role: schema_1.users.role,
        });
        if (!newUser) {
            return res.status(500).json({ message: "Error creating user" });
        }
        //generate JWT
        const token = await (0, jwt_1.generateToken)({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
        res
            .status(201)
            .json({ message: "User created successfully", user: newUser, token });
    }
    catch (e) {
        res.status(500).json({ message: "Error registering user" });
        console.error(e);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await connection_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
        });
        if (!user) {
            return res.status(401).json({ message: "invalid credential" });
        }
        const isValidPassword = await (0, password_2.comparePassword)(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = await (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
        return res.status(200).json({ message: "Login success", user, token });
    }
    catch (e) {
        res.status(500).json({ message: "Error logging in user" });
        console.error(e);
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map