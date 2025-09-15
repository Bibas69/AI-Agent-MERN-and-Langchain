const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

const createTask = async (req, res) => {
    try {
        const { uid, task } = req.body;
        const startTime = new Date(req.body.startTime);
        const duration = Number(req.body.duration);
        if (!uid) return res.status(400).json({ success: false, message: "Uid not found..." });
        if (!task || !startTime || !duration) return res.status(400).json({ success: false, message: "Task, time and duration is required..." });
        if (isNaN(startTime.getTime())) return res.status(400).json({ success: false, message: "Improper date format..." });
        startTime.setSeconds(0, 0);
        if (duration <= 0) return res.status(400).json({ success: false, message: "Duration cannot be less than or equal to 0 minutes..." })
        const endTime = new Date(startTime.getTime() + duration * 60000)
        if (startTime < new Date()) return res.status(400).json({ success: false, message: "Scheduled date cannot be in the past..." })
        const user = await userModel.findOne({ uid });
        if (!user) return res.status(404).json({ success: false, message: "User not found..." });
        const oldTask = await taskModel.findOne({
            user: user._id,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });
        if (oldTask) return res.status(400).json({ success: false, message: "You already have a task scheduled at the given time.", task: oldTask });
        const newTask = await taskModel.create({
            user: user._id,
            task,
            startTime,
            endTime,
            duration
        });
        return res.status(201).json({ success: true, message: "Task scheduled successfully.", task: newTask });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Server error...", error: err.message });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const { uid } = req.body;
        if (!uid) return res.status(400).json({ success: false, message: "Uid not found..." });
        const user = await userModel.findOne({ uid });
        if (!user) return res.status(404).json({ success: false, message: "User not found..." });
        const tasks = await taskModel.find({ user: user._id }).sort({ startTime: 1 });
        if (tasks.length === 0) return res.status(200).json({ success: true, message: "There are no tasks currently. Add tasks to view them...", tasks: [] });
        return res.status(200).json({ success: true, message: "Tasks fetched successfully.", tasks: tasks });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Server error...", error: err.message });
    }
}

const getTaskById = async (req, res) => {
    try {
        const { taskId, uid } = req.body;
        if (!taskId || !uid) return res.status(400).json({ success: false, message: "Task id and uid are required..." });
        const task = await taskModel.findById(taskId);
        if (!task) return res.status(404).json({ success: false, message: "No task found..." });
        const user = await userModel.findOne({ uid });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        if (!task.user.equals(user._id)) return res.status(401).json({ success: false, message: "Unauthorized access..." });
        return res.status(200).json({ success: true, message: "Task fetched successfully.", task: task });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

const filterTasksOfSingleDate = async (req, res) => {
    try {
        const { uid } = req.query;
        const date = new Date(req.query.date);
        if (!uid) return res.status(400).json({ success: false, message: "Uid is required." });
        if (!date || isNaN(date.getTime())) return res.status(400).json({ success: false, message: "Date not found or date is in invalid format." });
        const user = await userModel.findOne({ uid });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const tasks = await taskModel.find({
            user: user._id,
            startTime: { $lte: end },
            endTime: { $gte: start }
        }).sort({ startTime: 1 });
        if (tasks.length === 0) return res.status(200).json({ success: true, message: "No tasks available for the selected date.", tasks: [] });
        return res.status(200).json({ success: true, message: "Tasks for the selected date fetched successfully.", tasks: tasks });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Server error.", error: err.message });
    }
}

const filterTasksByDate = async (req, res) => {
    try {
        const { uid, startDate, endDate } = req.query;
        if (!uid) return res.status(400).json({ success: false, message: "Uid id required." });
        if (!startDate) return res.status(400).json({ success: false, message: "Start date is required." });
        const user = await userModel.findOne({ uid });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0)
        let end = !endDate ? new Date() : new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const tasks = await taskModel.find({
            user: user._id,
            startTime: { $lte: end },
            endTime: { $gte: start }
        })
        if (tasks.length === 0) return res.status(200).json({ success: true, message: "No tasks in the selected time frame.", tasks: [] });
        return res.status(200).json({ success: true, message: "Tasks from the selected time frame fetched successfully.", tasks: tasks });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Server error.", error: err.message });
    }
}

const filterTasksByDuration = async (req, res) => {
    try {
        const { uid } = req.query;
        const duration = Number(req.query.duration);
        if (!uid) return res.status(400).json({ success: false, message: "Uid is required." });
        if (isNaN(duration)) return res.status(400).json({ success: false, message: "Duration must be a number." });
        if (duration <= 0) return res.status(400).json({ success: false, message: "Duration cannot be negative, zero or null" });
        const user = await userModel.findOne({ uid });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        const tasks = await taskModel.find({
            user: user._id,
            duration: { $lte: duration }
        })
        if (tasks.length === 0) return res.status(200).json({ success: true, message: "No tasks found of the choosen duration", tasks: [] });
        return res.status(200).json({ success: true, message: "All the tasks of the choosen duration fetched successfully.", tasks: tasks });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Server error.", error: err.message });
    }
}

const findFreeSlots = async (req, res) => {
    try {
        const { uid, date } = req.query;
        if (!uid || !date) return res.status(400).json({ success: false, message: "Uid and date is required." });
        if (isNaN(date.getTime())) return res.status(400).json({ success: false, message: "Invalid date format." });
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const user = await userModel.findOne({ uid });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        const tasks = await taskModel.find({
            user: user._id,
            startTime: { $lte: end },
            endTime: { $gte: start }
        }).sort({ startTime: 1 });
        if (tasks.length === 0) return res.status(200).json({
            success: true,
            message: "Empty slot fetched successfully.",
            freeSlot: [{ start, end }]
        })
        let freeSlots = [];
        let pointer = new Date(start);
        tasks.map(task => {
            let taskStart = new Date(task.startTime);
            let taskEnd = new Date(task.endTime);
            if (taskStart > pointer) {
                freeSlots.push({ start: new Date(pointer), end: new Date(taskStart) });
            }
            if (taskEnd > pointer) {
                pointer = new Date(taskEnd);
            }
        })
        if (pointer < end) {
            freeSlots.push({ start: new Date(pointer), end: new Date(end) });
        }
        return res.status(200).json({ success: true, message: "Free slots fetched successfully.", freeSlots: freeSlots })
    }
    catch(err){
        return res.status(500).json({success: false, message: "Server error.", error: err.message});
    }
}

module.exports = { createTask, getAllTasks, getTaskById, filterTasksOfSingleDate, filterTasksByDate, filterTasksByDuration, findFreeSlots };