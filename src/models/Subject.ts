import mongoose, { Document, Schema } from "mongoose";

interface ISubject extends Document {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    description: string;
    credits: number;
    course_id: number;
    school_id: number;
    semester: number;
    department: string;
}

const subjectSchema = new Schema<ISubject>(
    {
        subject_id: {
            type: Number,
            required: true,
            unique: true,
            min: 1
        },

        subject_name: {
            type: String,
            required: true,
            trim: true
        },

        subject_code: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        credits: {
            type: Number,
            required: true,
            min: 1
        },

        course_id: {
            type: Number,
            required: true,
            min: 1
        },

        school_id: {
            type: Number,
            required: true,
            min: 1
        },

        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 8
        },

        department: {
            type: String,
            required: true,
            trim: true
        }


    },
    {
        timestamps: true
    }
);

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;