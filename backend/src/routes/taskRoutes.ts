import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createTaskValidation,
  taskIdValidation,
  taskQueryValidation,
  updateTaskValidation,
} from '../validators/taskValidators';

const router = Router();

router.use(authenticate);

router.get('/stats', taskController.getStats);
router.get('/', validate(taskQueryValidation), taskController.getTasks);
router.get('/:id', validate(taskIdValidation), taskController.getTask);
router.post('/', validate(createTaskValidation), taskController.createTask);
router.put('/:id', validate(updateTaskValidation), taskController.updateTask);
router.delete('/:id', validate(taskIdValidation), taskController.deleteTask);

export default router;
