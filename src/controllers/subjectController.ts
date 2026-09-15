import { successResponse } from "../utils/response";
import { Request, Response, NextFunction } from "express";
import subjectService from "../services/subjectService";
import logger from "../utils/logger";

interface SubjectRequestBody {
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

interface UpdateSubjectRequestBody {
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

class SubjectController {

    // CREATE SUBJECT
    async createSubject(
        req: Request<{}, {}, SubjectRequestBody>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            logger.info("Create subject request received");

            const subject = await subjectService.createSubject(req.body);

            res.status(201).json(
                successResponse("success", subject)
            );

        } catch (error: unknown) {
            next(error);
        }
    }


    // GET ALL SUBJECTS (paginated + field/value filter)
    async getAllSubjects(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const field = req.query.field as string | undefined;
            const value = req.query.value as string | undefined;
            const rawPage  = req.query.page  as string | undefined;
            const rawLimit = req.query.limit as string | undefined;

            const page  = rawPage  ? Number(rawPage)  : 1;
            const limit = rawLimit ? Number(rawLimit) : 10;

            // Validate pagination
            if (!Number.isInteger(page) || page < 1) {
                res.status(400).json({
                    status: "fail..!",
                    message: "Validation failed",
                    error: [{ field: "page", message: "page must be a positive integer" }]
                });
                return;
            }

            if (!Number.isInteger(limit) || limit < 1) {
                res.status(400).json({
                    status: "fail..!",
                    message: "Validation failed",
                    error: [{ field: "limit", message: "limit must be a positive integer" }]
                });
                return;
            }

            const skip = (page - 1) * limit;

            // If field+value provided, run filter
            if (field !== undefined || value !== undefined) {

                const allowedFields = [
                    "subject_id",
                    "subject_name",
                    "subject_code",
                    "description",
                    "credits",
                    "course_id",
                    "school_id",
                    "semester",
                    "department",
                    "email",
                    "password"
                ];

                const numericFields = [
                    "credits",
                    "course_id",
                    "school_id",
                    "semester"
                ];

                if (!field || field.trim() === "") {
                    res.status(400).json({
                        status: "fail..!",
                        message: "Validation failed",
                        error: [{ field: "field", message: "field is required when value is provided" }]
                    });
                    return;
                }

                if (!allowedFields.includes(field)) {
                    res.status(400).json({
                        status: "fail..!",
                        message: "Validation failed",
                        error: [{ field: "field", message: `'${field}' is not a valid subject field. Allowed fields: ${allowedFields.join(", ")}` }]
                    });
                    return;
                }

                if (!value || value.trim() === "") {
                    res.status(400).json({
                        status: "fail..!",
                        message: "Validation failed",
                        error: [{ field: "value", message: "value is required and cannot be empty" }]
                    });
                    return;
                }

                // Datatype validation — before any DB query
                const isNumericField = numericFields.includes(field);

                if (isNumericField) {
                    // Numeric field: value must be a valid number
                    if (isNaN(Number(value)) || value.trim() === "") {
                        res.status(400).json({
                            status: "fail..!",
                            message: "Invalid datatype",
                            error: `Invalid value for ${field}. Expected a number. Please provide a numeric value.`
                        });
                        return;
                    }
                } else {
                    // String field: value must not be a plain number
                    if (!isNaN(Number(value)) && value.trim() !== "") {
                        res.status(400).json({
                            status: "fail..!",
                            message: "Invalid datatype",
                            error: `Invalid value for ${field}. Expected a string. Please provide a valid text value.`
                        });
                        return;
                    }
                }

                logger.info("Filter subjects request received", { field, value, page, limit });

                const result = await subjectService.filterSubjects(
                    field,
                    value.trim(),
                    page,
                    limit,
                    skip
                );

                res.status(200).json(
                    successResponse("Subjects fetched successfully", result)
                );

                return;
            }

            // No filter — return all subjects paginated
            logger.info("Get all subjects request received", { page, limit, skip });

            const result = await subjectService.getAllSubjects(page, limit, skip);

            res.status(200).json(
                successResponse("Subjects fetched successfully", result)
            );

        } catch (error: unknown) {
            next(error);
        }
    }


    // GET SUBJECT BY ID
    async getSubjectById(
        req: Request<{ subject_id: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const subjectId = req.params.subject_id;

            logger.info("Get subject by ID request received", {
                subject_id: subjectId
            });

            const subject = await subjectService.getSubjectById(subjectId);

            res.status(200).json(
                successResponse("success", subject)
            );

        } catch (error: unknown) {
            next(error);
        }
    }


    // UPDATE SUBJECT
    async updateSubject(
        req: Request<
            { subject_id: string },
            {},
            UpdateSubjectRequestBody
        >,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const subjectId = req.params.subject_id;

            logger.info("Update subject request received", {
                subject_id: subjectId
            });

            const subject = await subjectService.updateSubject(
                subjectId,
                req.body
            );

            res.status(200).json(
                successResponse("success", subject)
            );

        } catch (error: unknown) {
            next(error);
        }
    }


    // DELETE SUBJECT
    async deleteSubject(
        req: Request<{ subject_id: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const subjectId = req.params.subject_id;

            logger.info("Delete subject request received", {
                subject_id: subjectId
            });

            const result = await subjectService.deleteSubject(subjectId);

            res.status(200).json(
                successResponse("success", result)
            );

        } catch (error: unknown) {
            next(error);
        }
    }
}

export default new SubjectController();