const express = require("express");
const { createTask, getAllTasks, getTaskById, filterTasksOfSingleDate, filterTasksByDate, filterTasksByDuration, findFreeSlots } = require("../controllers/taskController");
const router = express.Router();

router.post("/", createTask);
router.get("/all", getAllTasks);
router.get("/get/:taskId", getTaskById);
router.get("/getTaskBySingleDate", filterTasksOfSingleDate);
router.get("/getTaskOfSpecificDateRange", filterTasksByDate)
router.get("/getTaskByDuration", filterTasksByDuration);
router.get("/getFreeSlots", findFreeSlots);

module.exports = router;