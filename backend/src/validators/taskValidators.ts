import { body, param, query } from 'express-validator';

const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'];

export const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(taskStatuses)
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(taskPriorities)
    .withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
];

export const updateTaskValidation = [
  param('id').notEmpty().withMessage('Task ID is required'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(taskStatuses)
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(taskPriorities)
    .withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid due date'),
];

export const taskIdValidation = [
  param('id').notEmpty().withMessage('Task ID is required'),
];

export const taskQueryValidation = [
  query('status')
    .optional()
    .isIn(taskStatuses)
    .withMessage('Invalid status filter'),
  query('search').optional().trim(),
  query('sortBy')
    .optional()
    .isIn(['dueDate', 'createdAt', 'priority'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sort order'),
];
