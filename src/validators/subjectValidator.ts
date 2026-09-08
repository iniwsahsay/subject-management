import { BadRequestError } from "../utils/AppError";

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

class SubjectValidator {

    // CREATE
    static validateCreate(data: SubjectData): void {
        this.validateCommonFields(data);
    }

    // UPDATE
    static validateUpdate(data: UpdateSubjectData): void {
        this.validateCommonFields(data);
    }

    // COMMON VALIDATION
    static validateCommonFields(
        data: SubjectData | UpdateSubjectData
    ): void {

        const {
            subject_id,
            subject_name,
            subject_code,
            description,
            credits,
            course_id,
            school_id
        } = data;


        // Subject ID
        if (
            typeof subject_id !== "number" ||
            !Number.isInteger(subject_id) ||
            subject_id <= 0
        ) {
            throw new BadRequestError(
                "subject_id is required and must be a positive integer"
            );
        }


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
            typeof credits !== "number" ||
            !Number.isInteger(credits) ||
            credits <= 0
        ) {
            throw new BadRequestError(
                "credits is required and must be a positive integer"
            );
        }


        // Course ID - REQUIRED
        if (
            typeof course_id !== "number" ||
            !Number.isInteger(course_id) ||
            course_id <= 0
        ) {
            throw new BadRequestError(
                "course_id is required and must be a positive integer"
            );
        }


        // School ID - REQUIRED
        if (
            typeof school_id !== "number" ||
            !Number.isInteger(school_id) ||
            school_id <= 0
        ) {
            throw new BadRequestError(
                "school_id is required and must be a positive integer"
            );
        }
    }
}

export default SubjectValidator;