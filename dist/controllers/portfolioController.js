"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessProcesses = exports.getProcesses = exports.createTask = exports.createProcess = exports.getBusinessPhases = exports.getPhases = exports.getProjects = exports.createPhase = exports.createProject = exports.getBusiness = exports.createBusiness = void 0;
const portfolioModel_1 = require("../models/portfolioModel");
const validGoToMarket = ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships'];
const validateGoToMarket = (values) => {
    if (!Array.isArray(values))
        return ['goToMarket must be an array'];
    const invalidValues = values.filter((v) => !validGoToMarket.includes(v));
    return invalidValues;
};
// START:: Create a new business
const createBusiness = async (req, res) => {
    const { businessName, bizConcept, businessImage } = req.body;
    const userId = req.user?.id;
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
        const business = new portfolioModel_1.Business({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createBusiness = createBusiness;
// END:: Create a new business
const getBusiness = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    try {
        const businesses = await portfolioModel_1.Business.find({ userid: userId });
        res.status(200).json({ data: businesses });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBusiness = getBusiness;
// START:: Create a new Project
const createProject = async (req, res) => {
    const { businessId, projectName, projectDescription } = req.body;
    const userId = req.user?.id;
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
        const project = new portfolioModel_1.Project({
            businessId,
            projectName,
            projectDescription,
            userid: userId,
        });
        const saved = await project.save();
        res.status(201).json({ message: 'Project created successfully', data: saved });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createProject = createProject;
// END:: Create a new Project
// START:: Create a new Phase
const createPhase = async (req, res) => {
    const { projectId, phaseName, phaseDescription } = req.body;
    const userId = req.user?.id;
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
        const phase = new portfolioModel_1.Phase({
            projectId,
            phaseName,
            phaseDescription,
            userid: userId,
        });
        const saved = await phase.save();
        res.status(201).json({ message: 'Phase created successfully', data: saved });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createPhase = createPhase;
// END:: Create a new Phase
// START:: Get projects of a business
const getProjects = async (req, res) => {
    const { businessId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    if (!businessId) {
        res.status(400).json({ error: 'businessId is required.' });
        return;
    }
    try {
        const projects = await portfolioModel_1.Project.find({ businessId, userid: userId });
        res.status(200).json({ data: projects });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProjects = getProjects;
// END:: Get projects of a business
// START:: Get phases of a project
const getPhases = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    if (!projectId) {
        res.status(400).json({ error: 'projectId is required.' });
        return;
    }
    try {
        const phases = await portfolioModel_1.Phase.find({ projectId, userid: userId });
        res.status(200).json({ data: phases });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getPhases = getPhases;
// END:: Get phases of a project
// START:: Get all phases for a business
const getBusinessPhases = async (req, res) => {
    const { businessId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    if (!businessId) {
        res.status(400).json({ error: 'businessId is required.' });
        return;
    }
    try {
        const projects = await portfolioModel_1.Project.find({ businessId, userid: userId });
        const projectIds = projects.map(p => p._id.toString());
        const phases = await portfolioModel_1.Phase.find({ projectId: { $in: projectIds }, userid: userId });
        res.status(200).json({ data: phases });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBusinessPhases = getBusinessPhases;
// END:: Get all phases for a business
// START:: Create a new Process
const createProcess = async (req, res) => {
    const { businessId, phaseId, processName, projectId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    if (!businessId || !phaseId || !processName || !projectId) {
        res.status(400).json({ error: 'businessId, phaseId, projectId, and processName are required.' });
        return;
    }
    try {
        const process = new portfolioModel_1.ProcessModel({
            businessId,
            projectId,
            phaseId,
            processName,
            tasks: [],
            userid: userId,
        });
        const saved = await process.save();
        res.status(201).json({ message: 'Process created successfully', data: saved });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createProcess = createProcess;
// END:: Create a new Process
// START:: Create a new Task
const createTask = async (req, res) => {
    const { processId, taskName } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    if (!processId || !taskName) {
        res.status(400).json({ error: 'processId and taskName are required.' });
        return;
    }
    try {
        const updatedProcess = await portfolioModel_1.ProcessModel.findOneAndUpdate({ _id: processId, userid: userId }, { $push: { tasks: { taskName } } }, { new: true, runValidators: true });
        if (!updatedProcess) {
            res.status(404).json({ error: 'Process not found' });
            return;
        }
        const createdTask = updatedProcess.tasks[updatedProcess.tasks.length - 1];
        res.status(201).json({ message: 'Task created successfully', data: createdTask });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createTask = createTask;
// END:: Create a new Task
// START:: Get processes of a phase
const getProcesses = async (req, res) => {
    const { phaseId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    if (!phaseId) {
        res.status(400).json({ error: 'phaseId is required.' });
        return;
    }
    try {
        const processes = await portfolioModel_1.ProcessModel.find({ phaseId, userid: userId });
        res.status(200).json({ data: processes });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProcesses = getProcesses;
// END:: Get processes of a phase
// START:: Get all processes for a business
const getBusinessProcesses = async (req, res) => {
    const { businessId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }
    if (!businessId) {
        res.status(400).json({ error: 'businessId is required.' });
        return;
    }
    try {
        const processes = await portfolioModel_1.ProcessModel.find({ businessId, userid: userId });
        res.status(200).json({ data: processes });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBusinessProcesses = getBusinessProcesses;
// END:: Get all processes for a business
//# sourceMappingURL=portfolioController.js.map