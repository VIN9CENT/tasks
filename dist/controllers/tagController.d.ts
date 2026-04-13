import { Request, Response } from "express";
export declare const getAllTags: (_req: Request, res: Response) => Promise<void>;
export declare const getTagById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTag: (req: Request, res: Response) => Promise<void>;
export declare const updateTagById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const patchTagById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTagById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tagController.d.ts.map