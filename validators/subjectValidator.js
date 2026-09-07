const { BadRequestError } = require("../utils/AppError");

class SubjectValidator {

    static validateCreate(data) {
        this.validateCommonFields(data);
    }

    static validateUpdate(data) {
        this.validateCommonFields(data);
    }

    static validateCommonFields(data) {

        const {
            subject_name,
            subject_code,
            description,
            credits,
            course_id,
            school_id
        } = data;

        // Subject Name
        if (
            typeof subject_name !== "string" ||
            subject_name.trim() === ""
        ) {
            throw new BadRequestError(
                "subject_name is required and must be a string"
            );
        }

        // Subject Code
        if (
            typeof subject_code !== "string" ||
            subject_code.trim() === ""
        ) {
            throw new BadRequestError(
                "subject_code is required and must be a string"
            );
        }

        // Description - REQUIRED
        if (
            typeof description !== "string" ||
            description.trim() === ""
        ) {
            throw new BadRequestError(
                "description is required and must be a string"
            );
        }

        // Credits - REQUIRED
        if (
            !Number.isInteger(credits) ||
            credits <= 0
        ) {
            throw new BadRequestError(
                "credits is required and must be a positive integer"
            );
        }

        // Course ID - REQUIRED
        if (
            !Number.isInteger(course_id) ||
            course_id <= 0
        ) {
            throw new BadRequestError(
                "course_id is required and must be a positive integer"
            );
        }

        // School ID - REQUIRED
        if (
            !Number.isInteger(school_id) ||
            school_id <= 0
        ) {
            throw new BadRequestError(
                "school_id is required and must be a positive integer"
            );
        }
    }
}

module.exports = SubjectValidator;