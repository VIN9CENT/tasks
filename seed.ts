import "dotenv/config";
import { db } from "./src/db/connection";
import { users, taskTags, tasks, tags } from "./src/db/schema";

async function seed() {
  console.log("starting database seed ...");
  try {
    // clear existing data
    console.log("clearing existing tables");
    await db.delete(taskTags);
    await db.delete(tags);
    await db.delete(tasks);
    await db.delete(users);

    // create demo users
    console.log("creating demo users");
    const insertedUsers = await db
      .insert(users)
      .values([
        {
          name: "Reduzer Technologies",
          age: 21,
          email: "reduzer@example.com",
          password: "hashed_password",
        },
        {
          name: "John Doe",
          age: 18,
          email: "john@example.com",
          password: "hashed_password",
        },
        {
          name: "Jane Doe",
          age: 26,
          email: "jane@example.com",
          password: "hashed_password",
        },
        {
          name: "Alice Kiunjuri",
          age: 30,
          email: "alice@example.com",
          password: "hashed_password",
        },
      ])
      .returning();

    const demoUser = insertedUsers[0];
    if (!demoUser) throw new Error("Failed to create demo user"); // ← null check

    // create demo tasks
    console.log("creating demo tasks");
    const insertedTasks = await db
      .insert(tasks)
      .values([
        {
          summary: "Buy groceries",
          details: "Milk, Bread, Eggs",
          completed: false,
          userId: demoUser.id,
        },
        {
          summary: "Walk my dog",
          details: "Take my dog for his evening walks",
          completed: false,
          userId: demoUser.id,
        },
        {
          summary: "Do assignment",
          details: "Complete the TypeScript assignment",
          completed: false,
          userId: demoUser.id,
        },
      ])
      .returning();

    const demoTask = insertedTasks[0];
    if (!demoTask) throw new Error("Failed to create demo tasks"); // ← null check

    // create demo tags
    console.log("creating demo tags");
    const insertedTags = await db
      .insert(tags)
      .values([
        { name: "FE", color: "#00FF00" },
        { name: "DevOps", color: "#FFA500" },
        { name: "BE", color: "#FF0000" },
        { name: "UI/UX", color: "#800080" },
      ])
      .returning();

    const firstTag = insertedTags[0];
    if (!firstTag) throw new Error("Failed to create demo tags"); // ← null check

    // create demo task tag
    console.log("creating demo task tags");
    await db
      .insert(taskTags)
      .values({
        taskId: demoTask.id,
        tagId: firstTag.id,
      })
      .returning();

    console.log("database seed completed");
  } catch (e) {
    console.error(e);
  }
}

seed();
