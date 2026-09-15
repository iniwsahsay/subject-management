import Subject from "../models/Subject";
import logger from "../utils/logger";
import { v4 as uuidv4 } from "uuid";

import {
    BadRequestError,
    NotFoundError,
    SubjectNotFoundError,
    SubjectAlreadyExistsError
} from "../utils/AppError";


interface SubjectData {
    subject_name: string;
    subject_code: string;
    description: string;
    credits: number;
    course_id: number;
    school_id: number;
    semester: number;
    department: string;
    email: string;
    password: string;
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
    email?: string;
    password?: string;
}


class SubjectService {

    // CREATE
    async createSubject(subjectData: SubjectData) {

        try {

            const {
                subject_name,
                subject_code,
                description,
                credits,
                course_id,
                school_id,
                semester,
                department,
                email,
                password
            } = subjectData;

            // Auto-generate UUID for subject_id
            const subject_id = uuidv4();

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
                department,
                email,
                password
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
                    `Subject code '${subjectData.subject_code}' already exists`
                );

            }

            throw error;
        }
    }


    // FILTER BY FIELD
    async filterSubjects(
        field: string,
        value: string,
        page: number,
        limit: number,
        skip: number
    ) {

        try {

            const numericFields = [
                "credits",
                "course_id",
                "school_id",
                "semester"
            ];

            let query: Record<string, unknown>;

            if (numericFields.includes(field)) {
                // Numeric fields: convert value to number for exact match
                // For partial numeric match (e.g. value=2 matches 12, 20, 102),
                // fetch all and filter in-memory since MongoDB stores these as numbers
                const numericValue = Number(value);

                if (isNaN(numericValue)) {
                    throw new BadRequestError(
                        `Invalid value for ${field}. Expected a number. Please provide a numeric value.`
                    );
                }

                query = { [field]: numericValue };
            } else {
                // String fields: prefix match (case-insensitive)
                // e.g. value=math matches math, maths, mathematics, math department
                const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                query = { [field]: { $regex: `^${escaped}`, $options: "i" } };
            }

            const [subjects, totalItems] = await Promise.all([
                Subject.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Subject.countDocuments(query)
            ]);

            if (subjects.length === 0) {
                throw new NotFoundError(
                    `No subjects found where ${field} matches '${value}'`
                );
            }

            const totalPages = Math.ceil(totalItems / limit);

            logger.info("Subject filter completed", {
                field,
                value,
                page,
                limit,
                totalItems
            });

            return {
                subjects,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages
                }
            };

        } catch (error: unknown) {

            if (error instanceof Error) {
                logger.error(
                    `Error filtering subjects: ${error.message}`,
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


    // READ ALL (paginated)
    async getAllSubjects(page: number, limit: number, skip: number) {

        try {

            const [subjects, totalItems] = await Promise.all([
                Subject.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Subject.countDocuments()
            ]);

            const totalPages = Math.ceil(totalItems / limit);

            logger.info("All subjects retrieved successfully", {
                page,
                limit,
                totalItems,
                totalPages
            });

            return {
                subjects,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages
                }
            };

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
    async getSubjectById(subjectId: string) {

        try {

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
        subjectId: string,
        subjectData: UpdateSubjectData
    ) {

        try {

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
                error instanceof SubjectAlreadyExistsError
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
    async deleteSubject(subjectId: string) {

        try {

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