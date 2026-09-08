import Subject from "../models/Subject";
import logger from "../utils/logger";

import {
    BadRequestError,
    NotFoundError,
    ConflictError
} from "../utils/AppError";

interface SubjectData {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    description: string;
    credits: number;
    course_id: number;
    school_id: number;
}

interface UpdateSubjectData {
    subject_id?: number;
    subject_name?: string;
    subject_code?: string;
    description?: string;
    credits?: number;
    course_id?: number;
    school_id?: number;
}

class SubjectService {

    // CREATE
    async createSubject(subjectData: SubjectData) {
        try {
            const {
                subject_id,
                subject_name,
                subject_code,
                description,
                credits,
                course_id,
                school_id
            } = subjectData;

            const existingSubjectId = await Subject.findOne({
                subject_id
            });

            if (existingSubjectId) {
                throw new ConflictError(
                    `Subject ID '${subject_id}' already exists`
                );
            }

            const existingSubjectCode = await Subject.findOne({
                subject_code
            });

            if (existingSubjectCode) {
                throw new ConflictError(
                    `Subject code '${subject_code}' already exists`
                );
            }

            const subject = await Subject.create({
                subject_id,
                subject_name,
                subject_code,
                description,
                credits,
                course_id,
                school_id
            });

            logger.info("Subject created successfully", {
                subject_id: subject.subject_id,
                subject_code: subject.subject_code
            });

            return subject;

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error("Error creating subject", {
                    error: error.message,
                    stack: error.stack
                });
            }

            if (error instanceof ConflictError) {
                throw error;
            }

            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                (error as { code: number }).code === 11000
            ) {
                throw new ConflictError(
                    `Subject ID '${subjectData.subject_id}' or subject code '${subjectData.subject_code}' already exists`
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

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error("Error retrieving subjects", {
                    error: error.message,
                    stack: error.stack
                });
            }

            throw error;
        }
    }

    // READ BY ID
    async getSubjectById(subjectId: number) {
        if (!subjectId) {
            throw new BadRequestError("Invalid subject_id");
        }

        try {
            const subject = await Subject.findOne({
                subject_id: Number(subjectId)
            });

            if (!subject) {
                throw new NotFoundError(
                    `Subject with ID ${subjectId} not found`
                );
            }

            return subject;

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error("Error retrieving subject", {
                    subject_id: subjectId,
                    error: error.message,
                    stack: error.stack
                });
            }

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
    async updateSubject(
        subjectId: number,
        subjectData: UpdateSubjectData
    ) {
        if (!subjectId) {
            throw new BadRequestError("Invalid subject_id");
        }

        try {
            const subject = await Subject.findOne({
                subject_id: Number(subjectId)
            });

            if (!subject) {
                throw new NotFoundError(
                    `Subject with ID ${subjectId} not found`
                );
            }

            if (subjectData.subject_code) {
                const existingSubject = await Subject.findOne({
                    subject_code: subjectData.subject_code,
                    subject_id: {
                        $ne: Number(subjectId)
                    }
                });

                if (existingSubject) {
                    throw new ConflictError(
                        `Subject code '${subjectData.subject_code}' already exists`
                    );
                }
            }

            // Prevent subject_id from being changed
            const updateData = { ...subjectData };

            delete updateData.subject_id;

            const updatedSubject = await Subject.findOneAndUpdate(
                {
                    subject_id: Number(subjectId)
                },
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

            logger.info("Subject updated successfully", {
                subject_id: subjectId
            });

            return updatedSubject;

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error("Error updating subject", {
                    subject_id: subjectId,
                    error: error.message,
                    stack: error.stack
                });
            }

            if (
                error instanceof ConflictError ||
                error instanceof NotFoundError ||
                error instanceof BadRequestError
            ) {
                throw error;
            }

            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                (error as { code: number }).code === 11000
            ) {
                throw new ConflictError(
                    `Subject ID '${subjectData.subject_id}' or subject code '${subjectData.subject_code}' already exists`
                );
            }

            throw error;
        }
    }

    // DELETE
    async deleteSubject(subjectId: number) {
        if (!subjectId) {
            throw new BadRequestError("Invalid subject_id");
        }

        try {
            const subject = await Subject.findOneAndDelete({
                subject_id: Number(subjectId)
            });

            if (!subject) {
                throw new NotFoundError(
                    `Subject with ID ${subjectId} not found`
                );
            }

            logger.info("Subject deleted successfully", {
                subject_id: subject.subject_id
            });

            return {
                message: "Subject deleted successfully"
            };

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error("Error deleting subject", {
                    subject_id: subjectId,
                    error: error.message,
                    stack: error.stack
                });
            }

            throw error;
        }
    }
}

export default new SubjectService();