import { Request, Response, NextFunction } from 'express';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { taskService } from '../services/taskService';

export const taskController = {
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskService.getTasks(req.user!.userId, {
        status: req.query.status as TaskStatus | undefined,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as 'dueDate' | 'createdAt' | 'priority' | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      });
      res.json({ tasks });
    } catch (error) {
      next(error);
    }
  },

  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.getTaskById(req.user!.userId, String(req.params.id));
      res.json({ task });
    } catch (error) {
      next(error);
    }
  },

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const task = await taskService.createTask(req.user!.userId, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      const task = await taskService.updateTask(req.user!.userId, String(req.params.id), {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
      });
      res.json({ task });
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      await taskService.deleteTask(req.user!.userId, String(req.params.id));
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await taskService.getStats(req.user!.userId);
      res.json({ stats });
    } catch (error) {
      next(error);
    }
  },
};
