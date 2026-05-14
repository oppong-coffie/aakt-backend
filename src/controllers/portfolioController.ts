import { Request, Response } from 'express';
import { Business, Project, Phase, ProcessModel } from '../models/portfolioModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const validGoToMarket = ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships'];

const validateGoToMarket = (values: any): string[] => {
    if (!Array.isArray(values)) return ['goToMarket must be an array'];
    const invalidValues = values.filter((v: string) => !validGoToMarket.includes(v));
    return invalidValues;
};

// START:: Create a new business
export const createBusiness = async (req: Request, res: Response): Promise<void> => {
    const { businessName, bizConcept, businessImage } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!businessName) {
        res.status(400).json({ error: 'businessName is required.' });
        return;
    }

    if (!bizConcept) {
        res.status(400).json({ error: 'bizConcept is required.' });
        return;
    }

    const { product, customer, goToMarket, culture } = bizConcept;

    if (!product || !customer || !goToMarket || !culture) {
        res.status(400).json({ error: 'All bizConcept fields (product, customer, goToMarket, culture) are required.' });
        return;
    }

    const invalidValues = validateGoToMarket(goToMarket);
    if (invalidValues.length > 0) {
        res.status(400).json({ error: `Invalid goToMarket values: ${invalidValues.join(', ')}` });
        return;
    }

    try {
        const business = new Business({
            businessName,
            product,
            customer,
            goToMarket,
            culture,
            businessImage,
            userid: userId,
        });

        const saved = await business.save();
        res.status(201).json({ message: 'Business created successfully', data: saved });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Create a new business

export const getBusiness = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    try {
        const businesses = await Business.find({ userid: userId });
        res.status(200).json({ data: businesses });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// START:: Create a new Project
export const createProject = async (req: Request, res: Response): Promise<void> => {
    const { businessId, projectName, projectDescription } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!projectName) {
        res.status(400).json({ error: 'projectName is required.' });
        return;
    }

    if (!businessId) {
        res.status(400).json({ error: 'businessId is required.' });
        return;
    }

    try {
        const project = new Project({
            businessId,
            projectName,
            projectDescription,
            userid: userId,
        });

        const saved = await project.save();
        res.status(201).json({ message: 'Project created successfully', data: saved });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Create a new Project

// START:: Create a new Phase
export const createPhase = async (req: Request, res: Response): Promise<void> => {
    const { projectId, phaseName, phaseDescription } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!phaseName) {
        res.status(400).json({ error: 'phaseName is required.' });
        return;
    }

    if (!projectId) {
        res.status(400).json({ error: 'projectId is required.' });
        return;
    }

    try {
        const phase = new Phase({
            projectId,
            phaseName,
            phaseDescription,
            userid: userId,
        });

        const saved = await phase.save();
        res.status(201).json({ message: 'Phase created successfully', data: saved });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Create a new Phase

// START:: Get projects of a business
export const getProjects = async (req: Request, res: Response): Promise<void> => {
    const { businessId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!businessId) {
        res.status(400).json({ error: 'businessId is required.' });
        return;
    }

    try {
        const projects = await Project.find({ businessId, userid: userId });
        res.status(200).json({ data: projects });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get projects of a business

// START:: Assign folder to a project
export const updateProjectFolder = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    const { folderId } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!projectId || !folderId) {
        res.status(400).json({ error: 'projectId and folderId are required.' });
        return;
    }

    try {
        const updatedProject = await Project.findOneAndUpdate(
            { _id: projectId, userid: userId },
            { $set: { folderId } },
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.status(200).json({ message: 'Project folder updated successfully', data: updatedProject });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Assign folder to a project

// START:: Get phases of a project
export const getPhases = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!projectId) {
        res.status(400).json({ error: 'projectId is required.' });
        return;
    }

    try {
        const phases = await Phase.find({ projectId, userid: userId });
        res.status(200).json({ data: phases });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get phases of a project

// START:: Get all phases for a business
export const getBusinessPhases = async (req: Request, res: Response): Promise<void> => {
    const { businessId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!businessId) {
        res.status(400).json({ error: 'businessId is required.' });
        return;
    }

    try {
        const projects = await Project.find({ businessId, userid: userId });
        const projectIds = projects.map(p => p._id.toString());

        const phases = await Phase.find({ projectId: { $in: projectIds }, userid: userId });
        res.status(200).json({ data: phases });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get all phases for a business

// START:: Create a new Process
export const createProcess = async (req: Request, res: Response): Promise<void> => {
    const { businessId, phaseId, processName, projectId } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!businessId || !phaseId || !processName || !projectId) {
        res.status(400).json({ error: 'businessId, phaseId, projectId, and processName are required.' });
        return;
    }

    try {
        const process = new ProcessModel({
            businessId,
            projectId,
            phaseId,
            processName,
            documents: [],
            userid: userId,
        });

        const saved = await process.save();
        res.status(201).json({ message: 'Process created successfully', data: saved });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Create a new Process

// START:: Create a new Document
export const createDocument = async (req: Request, res: Response): Promise<void> => {
    const { processId, documentName, url } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!processId || !documentName || !url) {
        res.status(400).json({ error: 'processId, documentName, and url are required.' });
        return;
    }

    try {
        const updatedProcess = await ProcessModel.findOneAndUpdate(
            { _id: processId, userid: userId },
            { $push: { documents: { documentName, url } } },
            { new: true, runValidators: true }
        );

        if (!updatedProcess) {
            res.status(404).json({ error: 'Process not found' });
            return;
        }

        const createdDocument = updatedProcess.documents[updatedProcess.documents.length - 1];
        res.status(201).json({ message: 'Document created successfully', data: createdDocument });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Create a new Document

// START:: Get processes of a phase
export const getProcesses = async (req: Request, res: Response): Promise<void> => {
    const { phaseId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!phaseId) {
        res.status(400).json({ error: 'phaseId is required.' });
        return;
    }

    try {
        const processes = await ProcessModel.find({ phaseId, userid: userId });
        res.status(200).json({ data: processes });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get processes of a phase

// START:: Get all processes for a business
export const getBusinessProcesses = async (req: Request, res: Response): Promise<void> => {
    const { businessId } = req.params;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!businessId) {
        res.status(400).json({ error: 'businessId is required.' });
        return;
    }

    try {
        const processes = await ProcessModel.find({ businessId, userid: userId });
        res.status(200).json({ data: processes });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get all processes for a business