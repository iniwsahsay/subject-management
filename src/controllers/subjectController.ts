import { Request, Response, NextFunction } from "express";

import subjectService from "../services/subjectService";
import logger from "../utils/logger";
import SubjectValidator from "../validators/subjectValidator";

interface SubjectRequestBody {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    description: string;
    credits: number;
    course_id: number;
    school_id: number;
}

interface UpdateSubjectRequestBody {
    subject_id?: number;
    subject_name?: string;
    subject_code?: string;
    description?: string;
    credits?: number;
    course_id?: number;
    school_id?: number;
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

            SubjectValidator.validateCreate(req.body);

            const subject = await subjectService.createSubject(req.body);

            res.status(201).json({
                success: true,
                message: "Subject created successfully",
                data: subject
            });
        } catch (error: unknown) {
            next(error);
        }
    }


    // GET ALL SUBJECTS
    async getAllSubjects(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            logger.info("Get all subjects request received");

            const subjects = await subjectService.getAllSubjects();

            res.status(200).json({
                success: true,
                count: subjects.length,
                data: subjects
            });
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
            const subjectId = Number(req.params.subject_id);

            logger.info("Get subject by ID request received", {
                subject_id: subjectId
            });

            const subject =
                await subjectService.getSubjectById(subjectId);

            res.status(200).json({
                success: true,
                data: subject
            });
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
            const subjectId = Number(req.params.subject_id);

            logger.info("Update subject request received", {
                subject_id: subjectId
            });

            SubjectValidator.validateUpdate(req.body);

            const subject =
                await subjectService.updateSubject(
                    subjectId,
                    req.body
                );

            res.status(200).json({
                success: true,
                message: "Subject updated successfully",
                data: subject
            });
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
            const subjectId = Number(req.params.subject_id);

            logger.info("Delete subject request received", {
                subject_id: subjectId
            });

            const result =
                await subjectService.deleteSubject(subjectId);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}

export default new SubjectController();