import { MoreVertical, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Task } from '../types/task';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, completed: boolean) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const statusColors = {
  'todo': 'bg-gray-100 text-gray-700 border-gray-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'review': 'bg-purple-100 text-purple-700 border-purple-200',
  'completed': 'bg-green-100 text-green-700 border-green-200',
};

const statusLabels = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'completed': 'Completed',
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {

const { t } = useTranslation()

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.status === 'completed'}
              onCheckedChange={(checked: boolean) => onStatusChange(task.id, checked)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`text-gray-900 ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t('common:edit')}</DropdownMenuItem>
              <DropdownMenuItem>{t('common:duplicate')}</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">{t('common:delete')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {task.progress > 0 && task.status !== 'completed' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t('common:progress')}</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Badge className={`text-xs ${priorityColors[task.priority]}`} variant="outline">
              {task.priority}
            </Badge>
            <Badge className={`text-xs ${statusColors[task.status]}`} variant="outline">
              {statusLabels[task.status]}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">3</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Paperclip className="w-4 h-4" />
              <span className="text-xs">2</span>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </Card>
  );
}
