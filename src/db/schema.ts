import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";

export const roleEnum = pgEnum("role", ["admin", "user"]);
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  role: roleEnum("role").notNull().default("user"),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  summary: text("summary").notNull(),
  details: text("details"),
  completed: boolean("completed").default(false),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 20 }).unique().notNull(),
  color: varchar("color", { length: 50 }).notNull(),
});

export const taskTags = pgTable(
  "task_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id")
      .references(() => tasks.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [unique("task_tags_task_id_tag_id").on(table.taskId, table.tagId)],
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  taskTags: many(taskTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  taskTags: many(taskTags),
}));

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

//inserting user schema
export const insertUserSchema = createInsertSchema(users)
  .extend({
    name: z.string().min(1, "Name cannot be empty"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    age: z.number().min(18, "Must be at least 18 years old"),
  })
  .omit({ id: true, role: true });

export type NewUser = z.infer<typeof insertUserSchema>;
//updating User Schema
export const updateUserSchema = createInsertSchema(users)
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

export const idSchema = createSelectSchema(users).pick({ id: true });

export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserId = z.infer<typeof idSchema>;

// Tasks Schema
export const insertTaskSchema = createInsertSchema(tasks).extend({
  summary: z.string().min(1, "Summary cannot be empty"),
  details: z.string().min(1, "Details cannot be empty"),
  completed: z.boolean(),
  userId: z.string(),
});

export const updateTaskSchema = createInsertSchema(tasks)
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

export const taskIdSchema = createSelectSchema(tasks).pick({ id: true });

export type NewTask = Omit<typeof tasks.$inferInsert, "id">;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type TaskId = z.infer<typeof taskIdSchema>;

export const loginSchema = createSelectSchema(users)
  .pick({
    email: true,
    password: true,
  })
  .extend({
    email: z.email(),
    password: z.string(),
  });
export const createTagSchema = z.object({
  name: z.string().min(3, "Tag name must be at least 3 characters").max(50),
  color: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
      "Color must be a valid hex code",
    ),
});
export type Login = z.infer<typeof loginSchema>;
