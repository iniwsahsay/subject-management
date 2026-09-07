const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Subject", subjectSchema);