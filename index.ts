import express, { Request, Response } from "express";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks: Task[] = [
  { id: 1, title: "Learn TypeScript", completed: false },
  { id: 2, title: "Build Express Server", completed: true },
];

app.get("/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

// 3. POST
app.post("/tasks", (req: Request, res: Response) => {
  const { title } = req.body;

  const newTask: Task = {
    id: tasks.length + 1,
    title,
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
