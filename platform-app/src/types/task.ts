export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  tags: string[];
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}
