import Subject from "../models/Subject";
import logger from "../utils/logger";

import {
    BadRequestError,
    SubjectNotFoundError,
    SubjectAlreadyExistsError
} from "../utils/AppError";


interface SubjectData {
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


interface UpdateSubjectData {
    subject_id?: number;
    subject_name?: string;
    subject_code?: string;
    description?: string;
    credits?: number;
    course_id?: number;
    school_id?: number;
    semester?: number;
    department?: string;
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
                school_id,
                semester,
                department
            } = subjectData;


            // Check duplicate subject ID
            const existingSubjectId = await Subject.findOne({
                subject_id
            });


            if (existingSubjectId) {

                throw new SubjectAlreadyExistsError(
                    `Subject ID '${subject_id}' already exists`
                );

            }


            // Check duplicate subject code
            const existingSubjectCode = await Subject.findOne({
                subject_code
            });


            if (existingSubjectCode) {

                throw new SubjectAlreadyExistsError(
                    `Subject code '${subject_code}' already exists`
                );

            }


            // Create subject
            const subject = await Subject.create({
                subject_id,
                subject_name,
                subject_code,
                description,
                credits,
                course_id,
                school_id,
                semester,
                department
            });


            logger.info("Subject created successfully", {
                subject_id: subject.subject_id,
                subject_code: subject.subject_code
            });


            return subject;

        } catch (error: unknown) {

            if (error instanceof Error) {

                logger.error(
                    `Error creating subject: ${error.message}`,
                    {
                        error: error.message,
                        errorType: error.constructor.name,
                        stack: error.stack
                    }
                );

            }


            // Re-throw custom exception
            if (error instanceof SubjectAlreadyExistsError) {
                throw error;
            }


            // Handle MongoDB duplicate key error
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                (error as { code: number }).code === 11000
            ) {

                throw new SubjectAlreadyExistsError(
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

                logger.error(
                    `Error retrieving subjects: ${error.message}`,
                    {
                        error: error.message,
                        errorType: error.constructor.name,
                        stack: error.stack
                    }
                );

            }


            throw error;
        }
    }


    // READ BY ID
    async getSubjectById(subjectId: number) {

        try {

            // Validate subject ID
            if (
                !Number.isInteger(subjectId) ||
                subjectId <= 0
            ) {

                throw new BadRequestError(
                    "Invalid subject_id"
                );

            }


            const subject = await Subject.findOne({
                subject_id: subjectId
            });


            if (!subject) {

                throw new SubjectNotFoundError(subjectId);

            }


            logger.info("Subject retrieved successfully", {
                subject_id: subjectId
            });


            return subject;

        } catch (error: unknown) {

            if (error instanceof Error) {

                logger.error(
                    `Error retrieving subject: ${error.message}`,
                    {
                        subject_id: subjectId,
                        error: error.message,
                        errorType: error.constructor.name,
                        stack: error.stack
                    }
                );

            }


            throw error;
        }
    }


    // UPDATE
    async updateSubject(
        subjectId: number,
        subjectData: UpdateSubjectData
    ) {

        try {

            // Validate subject ID
            if (
                !Number.isInteger(subjectId) ||
                subjectId <= 0
            ) {

                throw new BadRequestError(
                    "Invalid subject_id"
                );

            }


            // Check whether subject exists
            const subject = await Subject.findOne({
                subject_id: subjectId
            });


            if (!subject) {

                throw new SubjectNotFoundError(subjectId);

            }


            // Check duplicate subject code
            if (subjectData.subject_code) {

                const existingSubject = await Subject.findOne({

                    subject_code: subjectData.subject_code,

                    subject_id: {
                        $ne: subjectId
                    }

                });


                if (existingSubject) {

                    throw new SubjectAlreadyExistsError(
                        `Subject code '${subjectData.subject_code}' already exists`
                    );

                }

            }


            // Prevent subject_id from being changed
            const updateData = {
                ...subjectData
            };

            delete updateData.subject_id;


            // Update subject
            const updatedSubject =
                await Subject.findOneAndUpdate(

                    {
                        subject_id: subjectId
                    },

                    updateData,

                    {
                        new: true,
                        runValidators: true
                    }

                );


            logger.info(
                "Subject updated successfully",
                {
                    subject_id: subjectId
                }
            );


            return updatedSubject;

        } catch (error: unknown) {

            if (error instanceof Error) {

                logger.error(
                    `Error updating subject: ${error.message}`,
                    {
                        subject_id: subjectId,
                        error: error.message,
                        errorType: error.constructor.name,
                        stack: error.stack
                    }
                );

            }


            // Re-throw custom exceptions
            if (
                error instanceof SubjectNotFoundError ||
                error instanceof SubjectAlreadyExistsError ||
                error instanceof BadRequestError
            ) {

                throw error;

            }


            // Handle MongoDB duplicate key error
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                (error as { code: number }).code === 11000
            ) {

                throw new SubjectAlreadyExistsError(
                    `Subject code '${subjectData.subject_code}' already exists`
                );

            }


            throw error;
        }
    }


    // DELETE
    async deleteSubject(subjectId: number) {

        try {

            // Validate subject ID
            if (
                !Number.isInteger(subjectId) ||
                subjectId <= 0
            ) {

                throw new BadRequestError(
                    "Invalid subject_id"
                );

            }


            const subject =
                await Subject.findOneAndDelete({
                    subject_id: subjectId
                });


            if (!subject) {

                throw new SubjectNotFoundError(subjectId);

            }


            logger.info(
                "Subject deleted successfully",
                {
                    subject_id: subject.subject_id
                }
            );


            return {
                message: "Subject deleted successfully"
            };

        } catch (error: unknown) {

            if (error instanceof Error) {

                logger.error(
                    `Error deleting subject: ${error.message}`,
                    {
                        subject_id: subjectId,
                        error: error.message,
                        errorType: error.constructor.name,
                        stack: error.stack
                    }
                );

            }


            throw error;
        }
    }
}


export default new SubjectService();