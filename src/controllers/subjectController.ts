import { successResponse } from "../utils/response";
import { Request, Response, NextFunction } from "express";
import subjectService from "../services/subjectService";
import logger from "../utils/logger";

interface SubjectRequestBody {
    subject_id: number;
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


    // GET ALL SUBJECTS
    async getAllSubjects(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const search = req.query.search as string | undefined;

            if (search && search.trim() !== "") {
                logger.info("Search subjects request received", { search });

                const subjects = await subjectService.searchSubjects(search.trim());

                res.status(200).json(
                    successResponse("success", subjects)
                );

            } else {
                logger.info("Get all subjects request received");

                const subjects = await subjectService.getAllSubjects();

                res.status(200).json(
                    successResponse("success", subjects)
                );
            }

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
            const subjectId = Number(req.params.subject_id);

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
            const subjectId = Number(req.params.subject_id);

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