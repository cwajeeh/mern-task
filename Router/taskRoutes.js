const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', taskController.getAllTasks);

router.use(authController.protect);

router.post('/', taskController.createTask);
router
  .route('/:id')
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .patch(taskController.updateTaskFields)
  .delete(taskController.deleteTask);

module.exports = router;
