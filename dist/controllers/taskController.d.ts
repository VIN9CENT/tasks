import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
export declare const getAllTasks: (req: Request, res: Response) => Promise<void>;
export declare const getMyTasks: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getTaskById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTask: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateTask: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const replaceTask: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTask: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const adminDeleteTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=taskController.d.ts.map