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

export interface TaskState {
  items: Task[]
  loading: boolean
  error: string | null
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

export interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export interface SidebarProps {
  projects: Project[];
  selectedProject: string | null;
  onProjectSelect: (projectId: string | null) => void;
}

export interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, completed: boolean) => void;
}

export interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  onAddTask: () => void;
}

export interface TaskStatsProps {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}