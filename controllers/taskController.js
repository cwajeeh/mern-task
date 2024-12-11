const Task = require("../models/taskModel")
const CatchAsync = require("../utils/catchAsync")

exports.getAllTasks = CatchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 100
  const skip = (page - 1) * limit

  const totalResults = await Task.countDocuments()
  const tasks = await Task.find().skip(skip).limit(limit)

  res.status(200).json({
    status: "success",
    results: tasks.length,
    page,
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
    data: { tasks },
  })
})

exports.createTask = CatchAsync(async (req, res) => {
  const task = await Task.create(req.body)
  res.status(200).json({
    status: "success",
    data: { task },
  })
})

exports.getTaskById = CatchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (!task) {
    return res.status(400).json({
      status: "fail",
      message: "Task not found",
    })
  }

  res.status(200).json({
    status: "success",
    data: { task },
  })
})

exports.updateTask = CatchAsync(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!task) {
    return res.status(400).json({
      status: "fail",
      message: "Task not found",
    })
  }

  res.status(200).json({
    status: "success",
    data: { task },
  })
})

exports.updateTaskFields = CatchAsync(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    })
  }

  res.status(200).json({
    status: "success",
    data: { task },
  })
})

exports.deleteTask = CatchAsync(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id)

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    })
  }

  res.status(204).json({
    status: "success",
    data: null,
  })
})
