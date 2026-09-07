const subjectService = require("../services/subjectService");
const logger = require("../utils/logger");
const SubjectValidator = require("../validators/subjectValidator");

class SubjectController {

    // CREATE SUBJECT
    async createSubject(req, res, next) {
        try {
            logger.info("Create subject request received");

            SubjectValidator.validateCreate(req.body);

            const subject = await subjectService.createSubject(req.body);

            res.status(201).json({
                success: true,
                message: "Subject created successfully",
                data: subject
            });

        } catch (error) {
            next(error);
        }
    }


    // GET ALL SUBJECTS
    async getAllSubjects(req, res, next) {
        try {
            logger.info("Get all subjects request received");

            const subjects = await subjectService.getAllSubjects();

            res.status(200).json({
                success: true,
                count: subjects.length,
                data: subjects
            });

        } catch (error) {
            next(error);
        }
    }


    // GET SUBJECT BY ID
    async getSubjectById(req, res, next) {
        try {
            const subjectId = req.params.id ;

            logger.info("Get subject by ID request received", {
                subject_id: subjectId
            });

            const subject =
                await subjectService.getSubjectById(subjectId);

            res.status(200).json({
                success: true,
                data: subject
            });

        } catch (error) {
            next(error);
        }
    }


    // UPDATE SUBJECT
    async updateSubject(req, res, next) {
        try {
            const subjectId = req.params.id;

            SubjectValidator.validateUpdate(req.body);

            logger.info("Update subject request received", {
                subject_id: subjectId
            });

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

        } catch (error) {
            next(error);
        }
    }


    // DELETE SUBJECT
    async deleteSubject(req, res, next) {
        try {
            const subjectId = req.params.id;

            logger.info("Delete subject request received", {
                subject_id: subjectId
            });

            const result =
                await subjectService.deleteSubject(subjectId);

            res.status(200).json({
                success: true,
                ...result
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SubjectController();