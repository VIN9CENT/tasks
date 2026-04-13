"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const validation_2 = require("../middleware/validation");
const schema_1 = require("../db/schema");
const auth_1 = require("../middleware/auth");
const tagController_1 = require("../controllers/tagController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get("", tagController_1.getAllTags);
router.get("/:id", (0, validation_1.validateParams)(schema_1.idSchema), tagController_1.getTagById);
router.post("", (0, validation_2.validateBody)(schema_1.createTagSchema), tagController_1.createTag);
router.put("/:id", (0, validation_1.validateParams)(schema_1.idSchema), tagController_1.updateTagById);
router.patch("/:id", (0, validation_1.validateParams)(schema_1.idSchema), tagController_1.patchTagById);
router.delete("/:id", (0, validation_1.validateParams)(schema_1.idSchema), tagController_1.deleteTagById);
exports.default = router;
//# sourceMappingURL=tagRoutes.js.map