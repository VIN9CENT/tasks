import { Request, Response, NextFunction } from "express";
import { JWTPayload, verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.error("Error verifying token");
      res.status(401).json({ error: "Invalid token" });

      return res.status(401).json({ meesage: "Not authenticated" });
    }
    const payload = await verifyToken(token);

    req.user = payload;

    next();
  } catch (error) {
    console.log("Error verifying token", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
