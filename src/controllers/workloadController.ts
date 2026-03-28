import { Response } from 'express';
import { Workload } from '../models/workloadModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Create a new workload
export const createWorkload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workloadname, status } = req.body;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const newWorkload = new Workload({
      userid,
      workloadname,
      status: status || 'Pending',
      tasks: [],
    });

    const savedWorkload = await newWorkload.save();
    res.status(201).json(savedWorkload);
  } catch (error) {
    console.error('Error creating workload:', error);
    res.status(500).json({ error: 'Failed to create workload' });
  }
};

// Create a task in a workload
export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workloadId } = req.params;
    const { taskname, status } = req.body;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const workload = await Workload.findOne({ _id: workloadId, userid });
    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    workload.tasks.push({ taskname, status: status || 'Todo' });
    await workload.save();

    res.status(201).json(workload);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Delete a workload
export const deleteWorkload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const deletedWorkload = await Workload.findOneAndDelete({ _id: id, userid });
    if (!deletedWorkload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    res.status(200).json({ message: 'Workload deleted successfully' });
  } catch (error) {
    console.error('Error deleting workload:', error);
    res.status(500).json({ error: 'Failed to delete workload' });
  }
};

// Delete a task in a workload
export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workloadId, taskId } = req.params;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const workload = await Workload.findOne({ _id: workloadId, userid });
    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    const initialTaskCount = workload.tasks.length;
    workload.tasks = workload.tasks.filter((task: any) => task._id.toString() !== taskId);

    if (workload.tasks.length === initialTaskCount) {
      res.status(404).json({ error: 'Task not found in workload' });
      return;
    }

    await workload.save();
    res.status(200).json(workload);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Change workload status to Archive
export const archiveWorkload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const workload = await Workload.findOneAndUpdate(
      { _id: id, userid },
      { status: 'Archive' },
      { returnDocument: 'after' }
    );

    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    res.status(200).json(workload);
  } catch (error) {
    console.error('Error archiving workload:', error);
    res.status(500).json({ error: 'Failed to archive workload' });
  }
};

// Edit workload name
export const editWorkloadName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const workload = await Workload.findOneAndUpdate(
      { _id: id, userid },
      { workloadname },
      { returnDocument: 'after' }
    );

    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    res.status(200).json(workload);
  } catch (error) {
    console.error('Error updating workload name:', error);
    res.status(500).json({ error: 'Failed to update workload name' });
  }
};

// Change workload status to In Progress
export const inprogressWorkload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const workload = await Workload.findOneAndUpdate(
      { _id: id, userid },
      { status: 'In Progress' },
      { returnDocument: 'after' }
    );

    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    res.status(200).json(workload);
  } catch (error) {
    console.error('Error setting workload in progress:', error);
    res.status(500).json({ error: 'Failed to set workload in progress' });
  }
};

// Fetch all workloads for a user
export const getWorkloads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const workloads = await Workload.find({ userid }).sort({ createdAt: -1 });
    res.status(200).json(workloads);
  } catch (error) {
    console.error('Error fetching workloads:', error);
    res.status(500).json({ error: 'Failed to fetch workloads' });
  }
};

// Edit a task name within a workload
export const editTaskName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const workload = await Workload.findOne({ _id: workloadId, userid });
    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    const task = workload.tasks.find((t: any) => t._id.toString() === taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    task.taskname = taskname;
    await workload.save();

    res.status(200).json(workload);
  } catch (error) {
    console.error('Error updating task name:', error);
    res.status(500).json({ error: 'Failed to update task name' });
  }
};

// Change task status to Completed
export const completeTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workloadId, taskId } = req.params;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const workload = await Workload.findOne({ _id: workloadId, userid });
    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    const task = workload.tasks.find((t: any) => t._id.toString() === taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    task.status = 'Completed';
    await workload.save();

    res.status(200).json(workload);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
};

// Change task status to Todo
export const todoTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workloadId, taskId } = req.params;
    const userid = req.user?.id;

    if (!userid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const workload = await Workload.findOne({ _id: workloadId, userid });
    if (!workload) {
      res.status(404).json({ error: 'Workload not found' });
      return;
    }

    const task = workload.tasks.find((t: any) => t._id.toString() === taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    task.status = 'Todo';
    await workload.save();

    res.status(200).json(workload);
  } catch (error) {
    console.error('Error setting task to todo:', error);
    res.status(500).json({ error: 'Failed to set task to todo' });
  }
};
