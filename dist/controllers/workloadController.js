"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoTask = exports.completeTask = exports.editTaskName = exports.getWorkloads = exports.inprogressWorkload = exports.editWorkloadName = exports.archiveWorkload = exports.deleteTask = exports.deleteWorkload = exports.createTask = exports.createWorkload = void 0;
const workloadModel_1 = require("../models/workloadModel");
// Create a new workload
const createWorkload = async (req, res) => {
    try {
        const { workloadname, status } = req.body;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const newWorkload = new workloadModel_1.Workload({
            userid,
            workloadname,
            status: status || 'Pending',
            tasks: [],
        });
        const savedWorkload = await newWorkload.save();
        res.status(201).json(savedWorkload);
    }
    catch (error) {
        console.error('Error creating workload:', error);
        res.status(500).json({ error: 'Failed to create workload' });
    }
};
exports.createWorkload = createWorkload;
// Create a task in a workload
const createTask = async (req, res) => {
    try {
        const { workloadId } = req.params;
        const { taskname, status } = req.body;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOne({ _id: workloadId, userid });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        workload.tasks.push({ taskname, status: status || 'Todo' });
        await workload.save();
        res.status(201).json(workload);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};
exports.createTask = createTask;
// Delete a workload
const deleteWorkload = async (req, res) => {
    try {
        const { id } = req.params;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const deletedWorkload = await workloadModel_1.Workload.findOneAndDelete({ _id: id, userid });
        if (!deletedWorkload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        res.status(200).json({ message: 'Workload deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting workload:', error);
        res.status(500).json({ error: 'Failed to delete workload' });
    }
};
exports.deleteWorkload = deleteWorkload;
// Delete a task in a workload
const deleteTask = async (req, res) => {
    try {
        const { workloadId, taskId } = req.params;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOne({ _id: workloadId, userid });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        const initialTaskCount = workload.tasks.length;
        workload.tasks = workload.tasks.filter((task) => task._id.toString() !== taskId);
        if (workload.tasks.length === initialTaskCount) {
            res.status(404).json({ error: 'Task not found in workload' });
            return;
        }
        await workload.save();
        res.status(200).json(workload);
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
// Change workload status to Archive
const archiveWorkload = async (req, res) => {
    try {
        const { id } = req.params;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOneAndUpdate({ _id: id, userid }, { status: 'Archive' }, { returnDocument: 'after' });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        res.status(200).json(workload);
    }
    catch (error) {
        console.error('Error archiving workload:', error);
        res.status(500).json({ error: 'Failed to archive workload' });
    }
};
exports.archiveWorkload = archiveWorkload;
// Edit workload name
const editWorkloadName = async (req, res) => {
    try {
        const { id } = req.params;
        const { workloadname } = req.body;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!workloadname) {
            res.status(400).json({ error: 'workloadname is required' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOneAndUpdate({ _id: id, userid }, { workloadname }, { returnDocument: 'after' });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        res.status(200).json(workload);
    }
    catch (error) {
        console.error('Error updating workload name:', error);
        res.status(500).json({ error: 'Failed to update workload name' });
    }
};
exports.editWorkloadName = editWorkloadName;
// Change workload status to In Progress
const inprogressWorkload = async (req, res) => {
    try {
        const { id } = req.params;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOneAndUpdate({ _id: id, userid }, { status: 'In Progress' }, { returnDocument: 'after' });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        res.status(200).json(workload);
    }
    catch (error) {
        console.error('Error setting workload in progress:', error);
        res.status(500).json({ error: 'Failed to set workload in progress' });
    }
};
exports.inprogressWorkload = inprogressWorkload;
// Fetch all workloads for a user
const getWorkloads = async (req, res) => {
    try {
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workloads = await workloadModel_1.Workload.find({ userid }).sort({ createdAt: -1 });
        res.status(200).json(workloads);
    }
    catch (error) {
        console.error('Error fetching workloads:', error);
        res.status(500).json({ error: 'Failed to fetch workloads' });
    }
};
exports.getWorkloads = getWorkloads;
// Edit a task name within a workload
const editTaskName = async (req, res) => {
    try {
        const { workloadId, taskId } = req.params;
        const { taskname } = req.body;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!taskname) {
            res.status(400).json({ error: 'taskname is required' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOne({ _id: workloadId, userid });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        const task = workload.tasks.find((t) => t._id.toString() === taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        task.taskname = taskname;
        await workload.save();
        res.status(200).json(workload);
    }
    catch (error) {
        console.error('Error updating task name:', error);
        res.status(500).json({ error: 'Failed to update task name' });
    }
};
exports.editTaskName = editTaskName;
// Change task status to Completed
const completeTask = async (req, res) => {
    try {
        const { workloadId, taskId } = req.params;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOne({ _id: workloadId, userid });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        const task = workload.tasks.find((t) => t._id.toString() === taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        task.status = 'Completed';
        await workload.save();
        res.status(200).json(workload);
    }
    catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Failed to complete task' });
    }
};
exports.completeTask = completeTask;
// Change task status to Todo
const todoTask = async (req, res) => {
    try {
        const { workloadId, taskId } = req.params;
        const userid = req.user?.id;
        if (!userid) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const workload = await workloadModel_1.Workload.findOne({ _id: workloadId, userid });
        if (!workload) {
            res.status(404).json({ error: 'Workload not found' });
            return;
        }
        const task = workload.tasks.find((t) => t._id.toString() === taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        task.status = 'Todo';
        await workload.save();
        res.status(200).json(workload);
    }
    catch (error) {
        console.error('Error setting task to todo:', error);
        res.status(500).json({ error: 'Failed to set task to todo' });
    }
};
exports.todoTask = todoTask;
//# sourceMappingURL=workloadController.js.map