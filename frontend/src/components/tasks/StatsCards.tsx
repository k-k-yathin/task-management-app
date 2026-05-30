import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import type { TaskStats } from '@/types';

interface StatsCardsProps {
  stats: TaskStats;
}

const cards = [
  { key: 'total' as const, label: 'Total Tasks', icon: ListTodo, color: 'from-brand-500 to-brand-700' },
  { key: 'todo' as const, label: 'To Do', icon: Clock, color: 'from-slate-500 to-slate-700' },
  {
    key: 'inProgress' as const,
    label: 'In Progress',
    icon: AlertCircle,
    color: 'from-amber-500 to-amber-700',
  },
  {
    key: 'completed' as const,
    label: 'Completed',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-emerald-700',
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">{card.label}</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}
            >
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats[card.key]}</p>
        </motion.div>
      ))}

      {stats.overdue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-full rounded-xl border border-red-500/30 bg-red-500/10 p-4 sm:col-span-2 xl:col-span-4"
        >
          <p className="text-sm text-red-400">
            <span className="font-semibold text-red-300">{stats.overdue}</span> overdue task
            {stats.overdue !== 1 ? 's' : ''} need attention
          </p>
        </motion.div>
      )}
    </div>
  );
}
