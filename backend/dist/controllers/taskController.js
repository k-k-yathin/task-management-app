"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const taskService_1 = require("../services/taskService");
exports.taskController = {
    async getTasks(req, res, next) {
        try {
            const tasks = await taskService_1.taskService.getTasks(req.user.userId, {
                status: req.query.status,
                search: req.query.search,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
            });
            res.json({ tasks });
        }
        catch (error) {
            next(error);
        }
    },
    async getTask(req, res, next) {
        try {
            const task = await taskService_1.taskService.getTaskById(req.user.userId, String(req.params.id));
            res.json({ task });
        }
        catch (error) {
            next(error);
        }
    },
    async createTask(req, res, next) {
        try {
            const { title, description, status, priority, dueDate } = req.body;
            const task = await taskService_1.taskService.createTask(req.user.userId, {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
            });
            res.status(201).json({ task });
        }
        catch (error) {
            next(error);
        }
    },
    async updateTask(req, res, next) {
        try {
            const { title, description, status, priority, dueDate } = req.body;
            const task = await taskService_1.taskService.updateTask(req.user.userId, String(req.params.id), {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(status !== undefined && { status }),
                ...(priority !== undefined && { priority }),
                ...(dueDate !== undefined && {
                    dueDate: dueDate ? new Date(dueDate) : null,
                }),
            });
            res.json({ task });
        }
        catch (error) {
            next(error);
        }
    },
    async deleteTask(req, res, next) {
        try {
            await taskService_1.taskService.deleteTask(req.user.userId, String(req.params.id));
            res.json({ message: 'Task deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    },
    async getStats(req, res, next) {
        try {
            const stats = await taskService_1.taskService.getStats(req.user.userId);
            res.json({ stats });
        }
        catch (error) {
            next(error);
        }
    },
};
