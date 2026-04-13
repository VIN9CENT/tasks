"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const schema_1 = require("../db/schema");
const validation_1 = require("../middleware/validation");
const authController_2 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_1.validateBody)(schema_1.insertUserSchema), authController_1.register);
router.post("/login", (0, validation_1.validateBody)(schema_1.loginSchema), authController_2.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map