import { Router } from "express";
import { validateParams } from "../middleware/validation";
import { validateBody } from "../middleware/validation";
import { createTagSchema, idSchema } from "../db/schema";
import {authenticateToken} from "../middleware/auth"
import {
  getAllTags,
  getTagById,
  createTag,
  updateTagById,
  patchTagById,
  deleteTagById,
} from "../controllers/tagController";

const router = Router();
router.use(authenticateToken)
router.get("", getAllTags);
router.get("/:id", validateParams(idSchema), getTagById);
router.post("", validateBody(createTagSchema), createTag);
router.put("/:id", validateParams(idSchema), updateTagById);
router.patch("/:id", validateParams(idSchema), patchTagById);
router.delete("/:id", validateParams(idSchema), deleteTagById);


export default router;
