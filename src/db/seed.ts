import "dotenv/config";
import { db } from "./connection";
import { users, taskTags, tasks, tags } from "./schema";

async function seed() {
  console.log("starting database seed ...");
  try {
    //clear existing data
    console.log("clearing existing tables");
    await db.delete(taskTags);
    await db.delete(tags);
    await db.delete(tasks);
    await db.delete(users);

    //create demo users
    console.log("creating demo users");
    const [demoUser] = await db
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

    //create demo tasks
    const [demoTasks] = await db
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
          details: "COmplete the TypeScript assignment",
          completed: false,
          userId: demoUser.id,
        },
      ])
      .returning();
    console.log("database seed completed");
    const insertedTags = await db
      .insert(tags)
      .values([
        { name: "FE", color: "green" },
        { name: "DevOps", color: "orange" },
        { name: "BE", color: "red" },
        { name: "UI/UX", color: "purple" },
      ])
      .returning();

    // Demo task tag
    const [demoTaskTag] = await db
      .insert(taskTags)
      .values({
        taskId: demoTasks.id,
        tagId: insertedTags[0].id,
      })
      .returning();
  } catch (e) {
    console.error(e);
  }
}

seed();
