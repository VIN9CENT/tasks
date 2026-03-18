import express, { Request, Response } from "express";

interface Task {
  id: number;
  summary: string;
  details: string;
  completed: boolean;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks: Task[] = [
  {
    id: 1,
    summary: "Learn TypeScript",
    details: "Learn the basics of TypeScript",
    completed: false,
  },
  {
    id: 2,
    summary: "Build Express Server",
    details: "Create a simple Express server",
    completed: true,
  },
];
let nextId = tasks.length + 1;

app.get("/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});
app.get("/tasks/:id", (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

// 3. POST
app.post("/tasks", (req: Request, res: Response) => {
  const { summary, details } = req.body;

  const newTask: Task = {
    id: nextId++,
    summary,
    details,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 4. PUT
app.put("/tasks/:id", (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = req.body.completed ?? task.completed;
  res.json(task);
});

// 5. DELETE
app.delete("/tasks/:id", (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);

  const taskExists = tasks.some((t) => t.id === id);

  if (!taskExists) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks = tasks.filter((t) => t.id !== id);

  res.status(200).json({ message: `Task ${id} deleted successfully` });
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
