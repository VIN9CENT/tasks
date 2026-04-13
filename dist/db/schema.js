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
exports.createTagSchema = exports.loginSchema = exports.taskIdSchema = exports.updateTaskSchema = exports.insertTaskSchema = exports.idSchema = exports.updateUserSchema = exports.insertUserSchema = exports.usersRelations = exports.taskTagsRelations = exports.tagsRelations = exports.tasksRelations = exports.taskTags = exports.tags = exports.tasks = exports.users = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_zod_1 = require("drizzle-zod");
const z = __importStar(require("zod"));
exports.roleEnum = (0, pg_core_1.pgEnum)("role", ["admin", "user"]);
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull().unique(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    age: (0, pg_core_1.integer)("age").notNull(),
    role: (0, exports.roleEnum)("role").notNull().default("user"),
});
exports.tasks = (0, pg_core_1.pgTable)("tasks", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    summary: (0, pg_core_1.text)("summary").notNull(),
    details: (0, pg_core_1.text)("details"),
    completed: (0, pg_core_1.boolean)("completed").notNull().default(false),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => exports.users.id, {
        onDelete: "cascade",
    }),
});
exports.tags = (0, pg_core_1.pgTable)("tags", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 20 }).unique().notNull(),
    color: (0, pg_core_1.varchar)("color", { length: 50 }).notNull(),
});
exports.taskTags = (0, pg_core_1.pgTable)("task_tags", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    taskId: (0, pg_core_1.uuid)("task_id")
        .references(() => exports.tasks.id, { onDelete: "cascade" })
        .notNull(),
    tagId: (0, pg_core_1.uuid)("tag_id")
        .references(() => exports.tags.id, { onDelete: "cascade" })
        .notNull(),
}, (table) => [(0, pg_core_1.unique)("task_tags_task_id_tag_id").on(table.taskId, table.tagId)]);
exports.tasksRelations = (0, drizzle_orm_1.relations)(exports.tasks, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.tasks.userId],
        references: [exports.users.id],
    }),
    taskTags: many(exports.taskTags),
}));
exports.tagsRelations = (0, drizzle_orm_1.relations)(exports.tags, ({ many }) => ({
    taskTags: many(exports.taskTags),
}));
exports.taskTagsRelations = (0, drizzle_orm_1.relations)(exports.taskTags, ({ one }) => ({
    task: one(exports.tasks, {
        fields: [exports.taskTags.taskId],
        references: [exports.tasks.id],
    }),
    tag: one(exports.tags, {
        fields: [exports.taskTags.tagId],
        references: [exports.tags.id],
    }),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    tasks: many(exports.tasks),
}));
//inserting user schema
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users)
    .extend({
    name: z.string().min(1, "Name cannot be empty"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    age: z.number().min(18, "Must be at least 18 years old"),
})
    .omit({ id: true, role: true });
//updating User Schema
exports.updateUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users)
    .extend({
    name: z.string().min(1, "Name cannot be empty"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    age: z.number().min(18, "Must be at least 18 years old"),
})
    .partial()
    .omit({ role: true })
    .extend({
    id: z.string(),
});
exports.idSchema = (0, drizzle_zod_1.createSelectSchema)(exports.users).pick({ id: true });
// Tasks Schema
exports.insertTaskSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tasks).extend({
    summary: z.string().min(1, "Summary cannot be empty"),
    details: z.string().min(1, "Details cannot be empty"),
    completed: z.boolean(),
    userId: z.string(),
});
exports.updateTaskSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tasks)
    .extend({
    summary: z.string().min(1, "Summary cannot be empty"),
    details: z.string().min(1, "Details cannot be empty"),
    completed: z.boolean(),
    userId: z.string(),
})
    .partial()
    .extend({
    id: z.string(),
});
exports.taskIdSchema = (0, drizzle_zod_1.createSelectSchema)(exports.tasks).pick({ id: true });
exports.loginSchema = (0, drizzle_zod_1.createSelectSchema)(exports.users)
    .pick({
    email: true,
    password: true,
})
    .extend({
    email: z.email(),
    password: z.string(),
});
exports.createTagSchema = z.object({
    name: z.string().min(3, "Tag name must be at least 3 characters").max(50),
    color: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Color must be a valid hex code"),
});
//# sourceMappingURL=schema.js.map