"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskQueryValidation = exports.taskIdValidation = exports.updateTaskValidation = exports.createTaskValidation = void 0;
const express_validator_1 = require("express-validator");
const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'];
exports.createTaskValidation = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(taskStatuses)
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(taskPriorities)
        .withMessage('Invalid priority'),
    (0, express_validator_1.body)('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
];
exports.updateTaskValidation = [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Task ID is required'),
    (0, express_validator_1.body)('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(taskStatuses)
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(taskPriorities)
        .withMessage('Invalid priority'),
    (0, express_validator_1.body)('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
];
exports.taskIdValidation = [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Task ID is required'),
];
exports.taskQueryValidation = [
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(taskStatuses)
        .withMessage('Invalid status filter'),
    (0, express_validator_1.query)('search').optional().trim(),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['dueDate', 'createdAt', 'priority'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Invalid sort order'),
];
