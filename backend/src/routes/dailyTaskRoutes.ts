import express from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/dailyTaskController';

const router = express.Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
