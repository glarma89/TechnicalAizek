import { Task } from './types/interfaces';

export const API_URL = "http://localhost:3001/api";

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return await response.json();
}

export type NewTask = Omit<Task, "id" | "created_at" | "updated_at">;

export async function addTask(task: NewTask): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to add task: ${response.status} ${text}`);
  }

  return (await response.json()) as Task;
}

