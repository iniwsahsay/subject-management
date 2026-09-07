const Subject = require("../models/Subject");
const logger = require("../utils/logger");

const {
    BadRequestError,
    NotFoundError,
    ConflictError
} = require("../utils/AppError");

class SubjectService {

    // CREATE
    async createSubject(subjectData) {
        try {
            const {
                subject_name,
                subject_code,
                description,
                credits,
                course_id,
                school_id
            } = subjectData;

            const existingSubject = await Subject.findOne({
                subject_code
            });

            if (existingSubject) {
                throw new ConflictError(
                    `Subject code '${subject_code}' already exists`
                );
            }

            const subject = await Subject.create({
                subject_name,
                subject_code,
                description,
                credits,
                course_id,
                school_id
            });

            logger.info("Subject created successfully", {
                subject_id: subject._id,
                subject_code: subject.subject_code
            });

            return subject;

        } catch (error) {
            logger.error("Error creating subject", {
                error: error.message,
                stack: error.stack
            });

            if (error instanceof ConflictError) {
                throw error;
            }

            if (error.code === 11000) {
                throw new ConflictError(
                    `Subject code '${subjectData.subject_code}' already exists`
                );
            }

            throw error;
        }
    }

    // READ ALL
    async getAllSubjects() {
        try {
            const subjects = await Subject.find()
                .sort({ createdAt: -1 });

            logger.info("All subjects retrieved successfully", {
                count: subjects.length
            });

            return subjects;

        } catch (error) {
            logger.error("Error retrieving subjects", {
                error: error.message,
                stack: error.stack
            });

            throw error;
        }
    }

    // READ BY ID
    async getSubjectById(subjectId) {

        if (!subjectId) {
            throw new BadRequestError("Invalid subject_id");
        }

        try {
            const subject = await Subject.findById(subjectId);

            if (!subject) {
                throw new NotFoundError(
                    `Subject with ID ${subjectId} not found`
                );
            }

            return subject;

        } catch (error) {
            logger.error("Error retrieving subject", {
                subject_id: subjectId,
                error: error.message,
                stack: error.stack
            });

            if (
                error instanceof BadRequestError ||
                error instanceof NotFoundError
            ) {
                throw error;
            }

            throw error;
        }
    }

    // UPDATE
    async updateSubject(subjectId, subjectData) {

        if (!subjectId) {
            throw new BadRequestError("Invalid subject_id");
        }

        try {
            const subject = await Subject.findById(subjectId);

            if (!subject) {
                throw new NotFoundError(
                    `Subject with ID ${subjectId} not found`
                );
            }

            if (subjectData.subject_code) {
                const existingSubject = await Subject.findOne({
                    subject_code: subjectData.subject_code,
                    _id: { $ne: subjectId }
                });

                if (existingSubject) {
                    throw new ConflictError(
                        `Subject code '${subjectData.subject_code}' already exists`
                    );
                }
            }

            const updatedSubject = await Subject.findByIdAndUpdate(
                subjectId,
                subjectData,
                {
                    new: true,
                    runValidators: true
                }
            );

            logger.info("Subject updated successfully", {
                subject_id: subjectId
            });

            return updatedSubject;

        } catch (error) {
            logger.error("Error updating subject", {
                subject_id: subjectId,
                error: error.message,
                stack: error.stack
            });

            if (
                error instanceof ConflictError ||
                error instanceof NotFoundError ||
                error instanceof BadRequestError
            ) {
                throw error;
            }

            if (error.code === 11000) {
                throw new ConflictError(
                    `Subject code '${subjectData.subject_code}' already exists`
                );
            }

            throw error;
        }
    }

    // DELETE
    async deleteSubject(subjectId) {

        if (!subjectId) {
            throw new BadRequestError("Invalid subject_id");
        }

        try {
            const subject = await Subject.findByIdAndDelete(subjectId);

            if (!subject) {
                throw new NotFoundError(
                    `Subject with ID ${subjectId} not found`
                );
            }

            logger.info("Subject deleted successfully", {
                subject_id: subjectId
            });

            return {
                message: "Subject deleted successfully"
            };

        } catch (error) {
            logger.error("Error deleting subject", {
                subject_id: subjectId,
                error: error.message,
                stack: error.stack
            });

            throw error;
        }
    }
}

module.exports = new SubjectService();