import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export interface TaskQueryParams {
  status?: TaskStatus;
  search?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
}

export const taskService = {
  async getTasks(userId: string, params: TaskQueryParams) {
    const where: Prisma.TaskWhereInput = { userId };

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    return prisma.task.findMany({ where, orderBy });
  },

  async getTaskById(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  },

  async createTask(userId: string, data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  },

  async updateTask(userId: string, taskId: string, data: UpdateTaskInput) {
    await this.getTaskById(userId, taskId);
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  },

  async deleteTask(userId: string, taskId: string) {
    await this.getTaskById(userId, taskId);
    await prisma.task.delete({ where: { id: taskId } });
  },

  async getStats(userId: string) {
    const [total, todo, inProgress, completed, overdue] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'TODO' } }),
      prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.task.count({
        where: {
          userId,
          status: { not: 'COMPLETED' },
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    const byPriority = await prisma.task.groupBy({
      by: ['priority'],
      where: { userId, status: { not: 'COMPLETED' } },
      _count: true,
    });

    return {
      total,
      todo,
      inProgress,
      completed,
      overdue,
      byPriority: byPriority.reduce(
        (acc, item) => {
          acc[item.priority] = item._count;
          return acc;
        },
        {} as Record<TaskPriority, number>
      ),
    };
  },
};
