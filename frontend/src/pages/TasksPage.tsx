import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFiltersBar } from '@/components/tasks/TaskFilters';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { taskService } from '@/services/taskService';
import { getErrorMessage } from '@/lib/api';
import type { CreateTaskInput, Task, TaskFilters } from '@/types';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(loadTasks, filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadTasks, filters.search]);

  const handleCreate = async (data: CreateTaskInput) => {
    await taskService.createTask(data);
    setModalOpen(false);
    loadTasks();
  };

  const handleUpdate = async (data: CreateTaskInput) => {
    if (!editingTask) return;
    await taskService.updateTask(editingTask.id, data);
    setModalOpen(false);
    setEditingTask(undefined);
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const openCreate = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">Tasks</h1>
            <p className="mt-1 text-slate-400">Manage and organize your work</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <TaskFiltersBar filters={filters} onChange={setFilters} />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 py-16 text-center">
            <p className="text-slate-400">No tasks found. Try adjusting filters or create a new task.</p>
            <Button className="mt-4" variant="secondary" onClick={openCreate}>
              Create Task
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(undefined);
        }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          key={editingTask?.id || 'new'}
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => {
            setModalOpen(false);
            setEditingTask(undefined);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}
