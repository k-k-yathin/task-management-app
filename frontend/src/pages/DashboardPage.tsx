import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/tasks/StatsCards';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { taskService } from '@/services/taskService';
import { getErrorMessage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Task, TaskStats } from '@/types';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, tasks] = await Promise.all([
          taskService.getStats(),
          taskService.getTasks({ sortBy: 'createdAt', sortOrder: 'desc' }),
        ]);
        setStats(statsData);
        setRecentTasks(tasks.slice(0, 4));
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-6xl space-y-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">
              Hello, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="mt-1 text-slate-400">Here&apos;s your task overview</p>
          </div>
          <Link to="/tasks">
            <Button>
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>

        {loading && <Spinner />}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {stats && <StatsCards stats={stats} />}

        {!loading && recentTasks.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
              <Link
                to="/tasks"
                className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          </section>
        )}

        {!loading && recentTasks.length === 0 && !error && (
          <div className="rounded-xl border border-dashed border-slate-700 py-16 text-center">
            <p className="text-slate-400">No tasks yet. Create your first one!</p>
            <Link to="/tasks" className="mt-4 inline-block">
              <Button variant="secondary">Go to Tasks</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
