"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const prisma_1 = require("../lib/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
exports.taskService = {
    async getTasks(userId, params) {
        const where = { userId };
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
        const orderBy = {
            [sortBy]: sortOrder,
        };
        return prisma_1.prisma.task.findMany({ where, orderBy });
    },
    async getTaskById(userId, taskId) {
        const task = await prisma_1.prisma.task.findFirst({
            where: { id: taskId, userId },
        });
        if (!task) {
            throw new errorHandler_1.AppError('Task not found', 404);
        }
        return task;
    },
    async createTask(userId, data) {
        return prisma_1.prisma.task.create({
            data: {
                ...data,
                userId,
            },
        });
    },
    async updateTask(userId, taskId, data) {
        await this.getTaskById(userId, taskId);
        return prisma_1.prisma.task.update({
            where: { id: taskId },
            data,
        });
    },
    async deleteTask(userId, taskId) {
        await this.getTaskById(userId, taskId);
        await prisma_1.prisma.task.delete({ where: { id: taskId } });
    },
    async getStats(userId) {
        const [total, todo, inProgress, completed, overdue] = await Promise.all([
            prisma_1.prisma.task.count({ where: { userId } }),
            prisma_1.prisma.task.count({ where: { userId, status: 'TODO' } }),
            prisma_1.prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
            prisma_1.prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
            prisma_1.prisma.task.count({
                where: {
                    userId,
                    status: { not: 'COMPLETED' },
                    dueDate: { lt: new Date() },
                },
            }),
        ]);
        const byPriority = await prisma_1.prisma.task.groupBy({
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
            byPriority: byPriority.reduce((acc, item) => {
                acc[item.priority] = item._count;
                return acc;
            }, {}),
        };
    },
};
