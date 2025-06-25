const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// GET /tasks
router.get('/', getTasks);

// POST /tasks
router.post('/', createTask);

// PUT /tasks/:id
router.put('/:id', updateTask);

// DELETE /tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
