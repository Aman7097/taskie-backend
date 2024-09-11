const Task = require("..//models/TaskModel");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // Find the maximum order in the status
    const maxOrderTask = await Task.findOne({ status })
      .sort({ order: -1 })
      .limit(1);

    const newOrder = maxOrderTask ? maxOrderTask.order + 1 : 1;

    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      owner: req.user.id,
      order: newOrder,
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error while creating task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { search, sortBy = "createdAt" } = req.query;

    // Build the query
    const query = { owner: req.user.id };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Define the sort object
    let sort = {};
    switch (sortBy) {
      case "Recent":
        sort = { createdAt: -1 };
        break;
      case "Due Date":
        sort = { dueDate: 1 }; // Ascending order for due dates
        break;
      case "Alphabetical":
        sort = { title: 1 }; // Ascending order for alphabetical sorting
        break;
      default:
        sort = { createdAt: -1 }; // Default to Recent
    }

    // Execute the query
    const tasks = await Task.find(query).sort(sort).exec();

    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.owner.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.owner.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    const { title, description, status, dueDate, order } = req.body;
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, dueDate, order },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const { query } = req.query;
    const tasks = await Task.find({
      owner: req.user.id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
