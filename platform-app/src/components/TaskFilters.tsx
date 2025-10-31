import { Search, 
  //Filter, 
  SlidersHorizontal, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

interface TaskFiltersProps {
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

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  //sortBy,
  onSortByChange,
  onAddTask,
}: TaskFiltersProps) {

const { t } = useTranslation()


  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onAddTask} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common:allStatus')}</SelectItem>
            <SelectItem value="todo">{t('common:toDo')}</SelectItem>
            <SelectItem value="in-progress">{t('common:inProgress')}</SelectItem>
            <SelectItem value="review">{t('common:review')}</SelectItem>
            <SelectItem value="completed">{t('common:completed')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common:allPriority')}</SelectItem>
            <SelectItem value="low">{t('common:low')}</SelectItem>
            <SelectItem value="medium">{t('common:medium')}</SelectItem>
            <SelectItem value="high">{t('common:high')}</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {t('common:sortBy')}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common:sortBy')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortByChange('dueDate')}>
              {t('common:dueDate')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortByChange('priority')}>
              {t('common:priority')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortByChange('status')}>
              {t('common:status')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortByChange('title')}>
              {t('common:title')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </button> */}
      </div>
    </div>
  );
}
