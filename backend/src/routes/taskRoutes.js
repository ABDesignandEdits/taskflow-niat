import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

// Subtasks
router.post('/:id/subtasks', taskController.addSubtask);
router.patch('/subtasks/:id/toggle', taskController.toggleSubtask);
router.delete('/subtasks/:id', taskController.deleteSubtask);

export default router;