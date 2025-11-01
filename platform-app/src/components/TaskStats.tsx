import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { Card } from './ui/card';
import { useTranslation } from 'react-i18next';

interface TaskStatsProps {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export function TaskStats({ total, completed, inProgress, overdue }: TaskStatsProps) {

const { t } = useTranslation('common')

  const stats = [
    {
      label: t('totalTasks'),
      value: total,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: t('completed'),
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: t('inProgress'),
      value: inProgress,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: t('overdue'),
      value: overdue,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
