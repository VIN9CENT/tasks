"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController = __importStar(require("../controllers/taskController"));
const validation_1 = require("../middleware/validation");
const schema_1 = require("../db/schema");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// user routes — any logged-in user
router.get("/me", auth_1.authenticateToken, taskController.getMyTasks);
router.post("/", auth_1.authenticateToken, (0, validation_1.validateBody)(schema_1.insertTaskSchema), taskController.createTask);
router.patch("/:id", auth_1.authenticateToken, (0, validation_1.validateParams)(schema_1.taskIdSchema), (0, validation_1.validateBody)(schema_1.updateTaskSchema), taskController.updateTask);
router.put("/:id", auth_1.authenticateToken, (0, validation_1.validateParams)(schema_1.taskIdSchema), (0, validation_1.validateBody)(schema_1.insertTaskSchema), taskController.replaceTask);
router.delete("/:id", auth_1.authenticateToken, (0, validation_1.validateParams)(schema_1.taskIdSchema), taskController.deleteTask);
// admin routes — token + admin role required
router.get("/", auth_1.authenticateToken, auth_1.authorizeAdmin, taskController.getAllTasks);
router.get("/:id", auth_1.authenticateToken, auth_1.authorizeAdmin, (0, validation_1.validateParams)(schema_1.taskIdSchema), taskController.getTaskById);
router.delete("/:id/force", auth_1.authenticateToken, auth_1.authorizeAdmin, (0, validation_1.validateParams)(schema_1.taskIdSchema), taskController.adminDeleteTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map