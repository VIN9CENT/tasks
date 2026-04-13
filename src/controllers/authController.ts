import type { Request, Response } from "express";
import { db } from "../db/connection";
import { Login, NewUser, users } from "../db/schema";
import { generateToken } from "../utils/jwt";
import { hashPassword } from "../utils/password";
import { eq } from "drizzle-orm";
import { comparePassword } from "../utils/password";

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response,
) => {
  try {
    const { age, email, name, password, role } = req.body as {
      age?: number;
      email?: string;
      name?: string;
      password?: string;
      role?: string;
    };

    // Basic validation
    if (
      typeof age !== "number" ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      typeof password !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Missing or invalid fields in request body" });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    //create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        age,
        role: (role ?? "user") as "admin" | "user",
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    if (!newUser) {
      return res.status(500).json({ message: "Error creating user" });
    }

    //generate JWT
    const token = await generateToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, token });
  } catch (e) {
    res.status(500).json({ message: "Error registering user" });
    console.error(e);
  }
};

export const login = async (req: Request<any, any, Login>, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      return res.status(401).json({ message: "invalid credential" });
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    return res.status(200).json({ message: "Login success", user, token });
  } catch (e) {
    res.status(500).json({ message: "Error logging in user" });
    console.error(e);
  }
};
