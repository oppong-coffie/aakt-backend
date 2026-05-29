import { Schema, model, Document, Types } from 'mongoose';

// 1. Skill
export interface ISkill extends Document {
    userId: Types.ObjectId;
    skillname: string;
    imageurl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        skillname: { type: String, required: true, trim: true },
        imageurl: { type: String, trim: true },
    },
    { timestamps: true }
);

skillSchema.index({ userId: 1 });

export const Skill = model<ISkill>('skills', skillSchema);


// 2. Skill Project
export interface ISkillProject extends Document {
    userId: Types.ObjectId;
    skillid: Types.ObjectId;
    projectname: string;
    projecturl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const skillProjectSchema = new Schema<ISkillProject>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        skillid: { type: Schema.Types.ObjectId, ref: 'skills', required: true },
        projectname: { type: String, required: true, trim: true },
        projecturl: { type: String, trim: true },
    },
    { timestamps: true }
);

skillProjectSchema.index({ userId: 1, skillid: 1 });

export const SkillProject = model<ISkillProject>('skillprojects', skillProjectSchema);


// 3. Skill Phase
export interface ISkillPhase extends Document {
    userId: Types.ObjectId;
    projectid: Types.ObjectId;
    phasename: string;
    createdAt: Date;
    updatedAt: Date;
}

const skillPhaseSchema = new Schema<ISkillPhase>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        projectid: { type: Schema.Types.ObjectId, ref: 'skillprojects', required: true },
        phasename: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

skillPhaseSchema.index({ userId: 1, projectid: 1 });

export const SkillPhase = model<ISkillPhase>('skillphases', skillPhaseSchema);


// 4. Skill Task
export interface ITaskDocument {
    _id?: Types.ObjectId;
    documentname: string;
    documenturl: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISkillTask extends Document {
    userId: Types.ObjectId;
    phaseid: Types.ObjectId;
    taskname: string;
    taskstatus: string;
    taskdocuments?: ITaskDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const taskDocumentSchema = new Schema<ITaskDocument>(
    {
        documentname: { type: String, required: true, trim: true },
        documenturl: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const skillTaskSchema = new Schema<ISkillTask>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        phaseid: { type: Schema.Types.ObjectId, ref: 'skillphases', required: true },
        taskname: { type: String, required: true, trim: true },
        taskstatus: { type: String, required: true, default: 'pending', trim: true },
        taskdocuments: { type: [taskDocumentSchema], default: [] },
    },
    { timestamps: true }
);

skillTaskSchema.index({ userId: 1, phaseid: 1 });

export const SkillTask = model<ISkillTask>('skilltasks', skillTaskSchema);


// 5. Skill Document
export interface ISkillDocument extends Document {
    userId: Types.ObjectId;
    phaseid: Types.ObjectId;
    documentname: string;
    documenturl: string;
    createdAt: Date;
    updatedAt: Date;
}

const skillDocumentSchema = new Schema<ISkillDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        phaseid: { type: Schema.Types.ObjectId, ref: 'skillphases', required: true },
        documentname: { type: String, required: true, trim: true },
        documenturl: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

skillDocumentSchema.index({ userId: 1, phaseid: 1 });

export const SkillDocument = model<ISkillDocument>('skilldocuments', skillDocumentSchema);
