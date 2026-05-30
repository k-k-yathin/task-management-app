import { api } from '@/lib/api';
import type { CreateTaskInput, Task, TaskFilters, TaskStats } from '@/types';

export const taskService = {
  async getTasks(filters?: TaskFilters) {
    const { data } = await api.get<{ tasks: Task[] }>('/tasks', { params: filters });
    return data.tasks;
  },

  async getTask(id: string) {
    const { data } = await api.get<{ task: Task }>(`/tasks/${id}`);
    return data.task;
  },

  async createTask(input: CreateTaskInput) {
    const { data } = await api.post<{ task: Task }>('/tasks', input);
    return data.task;
  },

  async updateTask(id: string, input: Partial<CreateTaskInput>) {
    const { data } = await api.put<{ task: Task }>(`/tasks/${id}`, input);
    return data.task;
  },

  async deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
  },

  async getStats() {
    const { data } = await api.get<{ stats: TaskStats }>('/tasks/stats');
    return data.stats;
  },
};
