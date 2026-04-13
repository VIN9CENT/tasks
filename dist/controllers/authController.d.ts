import type { Request, Response } from "express";
import { Login, NewUser } from "../db/schema";
export declare const register: (req: Request<any, any, NewUser>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request<any, any, Login>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authController.d.ts.map