import { LayoutDashboard, CheckSquare, Users, Settings, Plus, FolderKanban } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Project } from '../types/task.tsx';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  projects: Project[];
  selectedProject: string | null;
  onProjectSelect: (projectId: string | null) => void;
}

export function Sidebar({ projects, selectedProject, onProjectSelect }: SidebarProps) {
  const { t } = useTranslation()

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), active: false },
    { icon: CheckSquare, label: t('myTasks'), active: true },
    { icon: FolderKanban, label: t('projects'), active: false },
    { icon: Users, label: t('team'), active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">TaskFlow</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}

        {/* Projects Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{t('common:projects')}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1 mt-2">
            <button
              onClick={() => onProjectSelect(null)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                selectedProject === null
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="flex-1 text-left">{t('common:allProjects')}</span>
            </button>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  selectedProject === project.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                <span className="flex-1 text-left">{project.name}</span>
                <span className="text-xs text-gray-400">{project.taskCount}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@example.com</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
