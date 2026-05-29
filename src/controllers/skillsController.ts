import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import {
    Skill,
    SkillProject,
    SkillPhase,
    SkillTask,
    SkillDocument
} from '../models/skillsModel';

// ==========================================
// 1. SKILL CONTROLLERS
// ==========================================

export const createSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { skillname, imageurl } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!skillname) {
            res.status(400).json({ error: 'skillname is required' });
            return;
        }

        const newSkill = new Skill({
            userId,
            skillname,
            imageurl
        });

        const savedSkill = await newSkill.save();
        res.status(201).json(savedSkill);
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ error: 'Failed to create skill' });
    }
};

export const getSkills = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const skills = await Skill.find({ userId });
        res.status(200).json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
};

export const getSkillById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const skill = await Skill.findOne({ _id: id, userId });
        if (!skill) {
            res.status(404).json({ error: 'Skill not found' });
            return;
        }

        res.status(200).json(skill);
    } catch (error) {
        console.error('Error fetching skill:', error);
        res.status(500).json({ error: 'Failed to fetch skill' });
    }
};

export const updateSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { skillname, imageurl } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedSkill = await Skill.findOneAndUpdate(
            { _id: id, userId },
            { skillname, imageurl },
            { new: true, runValidators: true }
        );

        if (!updatedSkill) {
            res.status(404).json({ error: 'Skill not found' });
            return;
        }

        res.status(200).json(updatedSkill);
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ error: 'Failed to update skill' });
    }
};

export const deleteSkill = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Find all projects of this skill to cascade delete
        const projects = await SkillProject.find({ skillid: id, userId });
        const projectIds = projects.map(p => p._id);

        // Find all phases of those projects
        const phases = await SkillPhase.find({ projectid: { $in: projectIds }, userId });
        const phaseIds = phases.map(ph => ph._id);

        // Delete all downstream children
        await SkillDocument.deleteMany({ phaseid: { $in: phaseIds }, userId });
        await SkillTask.deleteMany({ phaseid: { $in: phaseIds }, userId });
        await SkillPhase.deleteMany({ projectid: { $in: projectIds }, userId });
        await SkillProject.deleteMany({ skillid: id, userId });

        const deletedSkill = await Skill.findOneAndDelete({ _id: id, userId });

        if (!deletedSkill) {
            res.status(404).json({ error: 'Skill not found' });
            return;
        }

        res.status(200).json({ message: 'Skill and all related items deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
};


// ==========================================
// 2. SKILL PROJECT CONTROLLERS
// ==========================================

export const createSkillProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { skillid, projectname, projecturl } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!skillid || !projectname) {
            res.status(400).json({ error: 'skillid and projectname are required' });
            return;
        }

        // Verify skill exists and belongs to user
        const skill = await Skill.findOne({ _id: skillid, userId });
        if (!skill) {
            res.status(404).json({ error: 'Associated Skill not found' });
            return;
        }

        const newProject = new SkillProject({
            userId,
            skillid,
            projectname,
            projecturl
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

export const getSkillProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { skillid } = req.query;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const filter: any = { userId };
        if (skillid) {
            filter.skillid = skillid;
        }

        const projects = await SkillProject.find(filter);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

export const getSkillProjectById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const project = await SkillProject.findOne({ _id: id, userId });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};

export const updateSkillProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { projectname, projecturl } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedProject = await SkillProject.findOneAndUpdate(
            { _id: id, userId },
            { projectname, projecturl },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};

export const deleteSkillProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Find phases of this project to cascade delete
        const phases = await SkillPhase.find({ projectid: id, userId });
        const phaseIds = phases.map(ph => ph._id);

        // Delete downstream children
        await SkillDocument.deleteMany({ phaseid: { $in: phaseIds }, userId });
        await SkillTask.deleteMany({ phaseid: { $in: phaseIds }, userId });
        await SkillPhase.deleteMany({ projectid: id, userId });

        const deletedProject = await SkillProject.findOneAndDelete({ _id: id, userId });

        if (!deletedProject) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.status(200).json({ message: 'Project and all related items deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};


// ==========================================
// 3. SKILL PHASE CONTROLLERS
// ==========================================

export const createSkillPhase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { projectid, phasename } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!projectid || !phasename) {
            res.status(400).json({ error: 'projectid and phasename are required' });
            return;
        }

        // Verify project exists and belongs to user
        const project = await SkillProject.findOne({ _id: projectid, userId });
        if (!project) {
            res.status(404).json({ error: 'Associated Project not found' });
            return;
        }

        const newPhase = new SkillPhase({
            userId,
            projectid,
            phasename
        });

        const savedPhase = await newPhase.save();
        res.status(201).json(savedPhase);
    } catch (error) {
        console.error('Error creating phase:', error);
        res.status(500).json({ error: 'Failed to create phase' });
    }
};

export const getSkillPhases = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { projectid } = req.query;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const filter: any = { userId };
        if (projectid) {
            filter.projectid = projectid;
        }

        const phases = await SkillPhase.find(filter);
        res.status(200).json(phases);
    } catch (error) {
        console.error('Error fetching phases:', error);
        res.status(500).json({ error: 'Failed to fetch phases' });
    }
};

export const getSkillPhaseById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const phase = await SkillPhase.findOne({ _id: id, userId });
        if (!phase) {
            res.status(404).json({ error: 'Phase not found' });
            return;
        }

        res.status(200).json(phase);
    } catch (error) {
        console.error('Error fetching phase:', error);
        res.status(500).json({ error: 'Failed to fetch phase' });
    }
};

export const updateSkillPhase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { phasename } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedPhase = await SkillPhase.findOneAndUpdate(
            { _id: id, userId },
            { phasename },
            { new: true, runValidators: true }
        );

        if (!updatedPhase) {
            res.status(404).json({ error: 'Phase not found' });
            return;
        }

        res.status(200).json(updatedPhase);
    } catch (error) {
        console.error('Error updating phase:', error);
        res.status(500).json({ error: 'Failed to update phase' });
    }
};

export const deleteSkillPhase = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Delete downstream children
        await SkillDocument.deleteMany({ phaseid: id, userId });
        await SkillTask.deleteMany({ phaseid: id, userId });

        const deletedPhase = await SkillPhase.findOneAndDelete({ _id: id, userId });

        if (!deletedPhase) {
            res.status(404).json({ error: 'Phase not found' });
            return;
        }

        res.status(200).json({ message: 'Phase and all related items deleted successfully' });
    } catch (error) {
        console.error('Error deleting phase:', error);
        res.status(500).json({ error: 'Failed to delete phase' });
    }
};


// ==========================================
// 4. SKILL TASK CONTROLLERS
// ==========================================

export const createSkillTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { phaseid, taskname, taskstatus } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!phaseid || !taskname) {
            res.status(400).json({ error: 'phaseid and taskname are required' });
            return;
        }

        // Verify phase exists and belongs to user
        const phase = await SkillPhase.findOne({ _id: phaseid, userId });
        if (!phase) {
            res.status(404).json({ error: 'Associated Phase not found' });
            return;
        }

        const newTask = new SkillTask({
            userId,
            phaseid,
            taskname,
            taskstatus: taskstatus || 'pending'
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

export const getSkillTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { phaseid } = req.query;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const filter: any = { userId };
        if (phaseid) {
            filter.phaseid = phaseid;
        }

        const tasks = await SkillTask.find(filter);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const getSkillTaskById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const task = await SkillTask.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

export const updateSkillTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { taskname, taskstatus } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedTask = await SkillTask.findOneAndUpdate(
            { _id: id, userId },
            { taskname, taskstatus },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

export const deleteSkillTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedTask = await SkillTask.findOneAndDelete({ _id: id, userId });

        if (!deletedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};


// ==========================================
// 5. SKILL DOCUMENT CONTROLLERS
// ==========================================

export const createSkillDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { phaseid, documentname, documenturl } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!phaseid || !documentname || !documenturl) {
            res.status(400).json({ error: 'phaseid, documentname, and documenturl are required' });
            return;
        }

        // Verify phase exists and belongs to user
        const phase = await SkillPhase.findOne({ _id: phaseid, userId });
        if (!phase) {
            res.status(404).json({ error: 'Associated Phase not found' });
            return;
        }

        const newDocument = new SkillDocument({
            userId,
            phaseid,
            documentname,
            documenturl
        });

        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
};

export const getSkillDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { phaseid } = req.query;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const filter: any = { userId };
        if (phaseid) {
            filter.phaseid = phaseid;
        }

        const documents = await SkillDocument.find(filter);
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

export const getSkillDocumentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const document = await SkillDocument.findOne({ _id: id, userId });
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        res.status(200).json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
};

export const updateSkillDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { documentname, documenturl } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedDocument = await SkillDocument.findOneAndUpdate(
            { _id: id, userId },
            { documentname, documenturl },
            { new: true, runValidators: true }
        );

        if (!updatedDocument) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ error: 'Failed to update document' });
    }
};

export const deleteSkillDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedDocument = await SkillDocument.findOneAndDelete({ _id: id, userId });

        if (!deletedDocument) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};


// ==========================================
// 6. SKILL TASK DOCUMENT CONTROLLERS (NESTED)
// ==========================================

export const addTaskDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { documentname, documenturl } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!documentname || !documenturl) {
            res.status(400).json({ error: 'documentname and documenturl are required' });
            return;
        }

        const task = await SkillTask.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        if (!task.taskdocuments) {
            task.taskdocuments = [];
        }

        const newDoc = { documentname, documenturl };
        task.taskdocuments.push(newDoc as any);
        await task.save();

        const addedDoc = task.taskdocuments[task.taskdocuments.length - 1];
        res.status(201).json(addedDoc);
    } catch (error) {
        console.error('Error adding task document:', error);
        res.status(500).json({ error: 'Failed to add task document' });
    }
};

export const getTaskDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const task = await SkillTask.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.status(200).json(task.taskdocuments || []);
    } catch (error) {
        console.error('Error fetching task documents:', error);
        res.status(500).json({ error: 'Failed to fetch task documents' });
    }
};

export const deleteTaskDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id, docId } = req.params;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const task = await SkillTask.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        if (!task.taskdocuments || task.taskdocuments.length === 0) {
            res.status(404).json({ error: 'No documents found in this task' });
            return;
        }

        const documentExists = task.taskdocuments.some(doc => doc._id?.toString() === docId);
        if (!documentExists) {
            res.status(404).json({ error: 'Document not found in task' });
            return;
        }

        task.taskdocuments = task.taskdocuments.filter(doc => doc._id?.toString() !== docId) as any;
        await task.save();

        res.status(200).json({ message: 'Document deleted successfully from task' });
    } catch (error) {
        console.error('Error deleting task document:', error);
        res.status(500).json({ error: 'Failed to delete task document' });
    }
};

