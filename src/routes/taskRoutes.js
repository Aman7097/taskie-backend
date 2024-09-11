const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

// Placeholder for your task controller

router.get("/", authCheck, taskController.getTasks);

// Get a single task
router.get("/:id", authCheck, taskController.getTask);

// Create a new task
router.post("/create", authCheck, taskController.createTask);

// Update a task
router.put("/:id", authCheck, taskController.updateTask);

// Delete a task
router.delete("/:id", authCheck, taskController.deleteTask);

module.exports = router;
