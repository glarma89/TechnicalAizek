import { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { TaskFilters } from './components/TaskFilters';
import { TaskStats } from './components/TaskStats';
import { AddTaskDialog } from './components/AddTaskDialog';
import { Task, Project } from './types/task';
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'
import { useDispatch, useSelector } from 'react-redux' // ###------------------------------------
import type { RootState, AppDispatch } from './store' // ###------------------------------------
import { fetchTasks, addTask, toggleTask, deleteTask, editTask } from './store/taskSlice' // ###------------------------------------




const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern and responsive landing page design with updated brand colors',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-11-05',
    assignee: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    tags: ['design', 'ui/ux', 'urgent'],
    progress: 65,
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-11-03',
    assignee: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    tags: ['backend', 'security'],
    progress: 40,
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples and response schemas',
    status: 'review',
    priority: 'medium',
    dueDate: '2025-11-10',
    assignee: {
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    tags: ['documentation', 'api'],
    progress: 90,
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment with GitHub Actions',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-11-15',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    tags: ['devops', 'automation'],
    progress: 0,
  },
  {
    id: '5',
    title: 'Create marketing materials',
    description: 'Design social media posts and email templates for product launch',
    status: 'completed',
    priority: 'low',
    dueDate: '2025-10-28',
    assignee: {
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    },
    tags: ['marketing', 'design'],
    progress: 100,
  },
  {
    id: '6',
    title: 'Optimize database queries',
    description: 'Improve performance of slow queries and add proper indexing',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-11-01',
    assignee: {
      name: 'Tom Anderson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    tags: ['backend', 'performance'],
    progress: 25,
  },
  {
    id: '7',
    title: 'User testing session',
    description: 'Conduct usability testing with 10 participants and gather feedback',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-11-12',
    assignee: {
      name: 'Rachel Green',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    },
    tags: ['research', 'ux'],
    progress: 0,
  },
  {
    id: '8',
    title: 'Mobile app bug fixes',
    description: 'Fix reported bugs in iOS and Android versions',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-11-02',
    assignee: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    },
    tags: ['mobile', 'bugfix'],
    progress: 70,
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { t } = useTranslation('common')
  const dispatch = useDispatch<AppDispatch>() // ###------------------------------------
  const { items, loading, error } = useSelector((s: RootState) => s.tasks) // ###------------------------------------
  const [title, setTitle] = useState('') // ###------------------------------------

  const initialProjects: Project[] = [
  { id: '1', name: t('websiteRedesign'), color: 'bg-purple-500', taskCount: 12 },
  { id: '2', name: t('mobileApp'), color: 'bg-blue-500', taskCount: 8 },
  { id: '3', name: t('marketingCampaign'), color: 'bg-green-500', taskCount: 15 },
  { id: '4', name: t('productLaunch'), color: 'bg-orange-500', taskCount: 6 },
];

  const handleStatusChange = (taskId: string, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: completed ? 'completed' : 'todo', progress: completed ? 100 : 0 }
          : task
      )
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    };
    setTasks([task, ...tasks]);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          // const priorityOrder = { high: 0, medium: 1, low: 2 };
          { const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority]; }
        case 'status':
          // const statusOrder = { 'in-progress': 0, 'review': 1, 'todo': 2, 'completed': 3 };
          { const statusOrder = { 'in-progress': 0, 'review': 1, 'todo': 2, 'completed': 3 };
          return statusOrder[a.status] - statusOrder[b.status]; }
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const overdue = tasks.filter(
      (t) => new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length;

    return { total, completed, inProgress, overdue };
  }, [tasks]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div style={{ padding: 16 }}>
        <LanguageSwitcher />

        <h1>{t('title')}</h1>

        <p>{t('hello', { name: 'Dasha' })}</p>
        <p>{t('inbox', { count: 1 })}</p>
        <p>{t('inbox', { count: 5 })}</p>
      </div>
      <Sidebar
        projects={initialProjects}
        selectedProject={selectedProject}
        onProjectSelect={setSelectedProject}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-gray-900 mb-2">{t('myTasks')}</h1>
            <p className="text-gray-500">{t('textManage')}</p>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <TaskStats {...stats} />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <TaskFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onAddTask={() => setIsAddTaskOpen(true)}
            />
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noTasks')}</p>
              </div>
            ) : (
              filteredAndSortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
