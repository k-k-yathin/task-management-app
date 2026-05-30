import { motion } from 'framer-motion';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/types';
import {
  formatDate,
  isOverdue,
  priorityColors,
  priorityLabels,
  statusColors,
  statusLabels,
} from '@/utils/format';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-slate-700 hover:bg-slate-900"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-semibold text-white">{task.title}</h3>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-brand-400"
            aria-label="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mb-4 line-clamp-2 text-sm text-slate-400">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>
        <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]} priority
        </span>
      </div>

      <div
        className={`mt-3 flex items-center gap-1.5 text-xs ${
          overdue ? 'text-red-400' : 'text-slate-500'
        }`}
      >
        <Calendar className="h-3.5 w-3.5" />
        {overdue ? 'Overdue: ' : ''}
        {formatDate(task.dueDate)}
      </div>
    </motion.div>
  );
}
