import { Validator } from "../decorators/Validator";

export class SubjectDto {

    @Validator({
        required: true,
        type: "number",
        min: 1
    })
    subject_id!: number;

    @Validator({
        required: true,
        type: "string",
        minLength: 2,
        maxLength: 100
    })
    subject_name!: string;

    @Validator({
        required: true,
        type: "string",
        minLength: 2,
        maxLength: 20
    })
    subject_code!: string;

    @Validator({
        required: true,
        type: "string",
        maxLength: 500
    })
    description!: string;

    @Validator({
        required: true,
        type: "number",
        min: 1,
        max: 10
    })
    credits!: number;

    @Validator({
        required: true,
        type: "number",
        min: 1
    })
    course_id!: number;

    @Validator({
        required: true,
        type: "number",
        min: 1
    })
    school_id!: number;

    @Validator({
        required: true,
        type: "number",
        min: 1,
        max: 8
    })
    semester!: number;

    @Validator({
        required: true,
        type: "string",
        minLength: 2,
        maxLength: 50
    })
    department!: string;

}

export class UpdateSubjectDto {

    @Validator({
        required: false,
        type: "string",
        minLength: 2,
        maxLength: 100
    })
    subject_name?: string;

    @Validator({
        required: false,
        type: "string",
        minLength: 2,
        maxLength: 20
    })
    subject_code?: string;

    @Validator({
        required: false,
        type: "string",
        maxLength: 500
    })
    description?: string;

    @Validator({
        required: false,
        type: "number",
        min: 1,
        max: 10
    })
    credits?: number;

    @Validator({
        required: false,
        type: "number",
        min: 1
    })
    course_id?: number;

    @Validator({
        required: false,
        type: "number",
        min: 1
    })
    school_id?: number;

    @Validator({
        required: false,
        type: "number",
        min: 1,
        max: 8
    })
    semester?: number;

    @Validator({
        required: false,
        type: "string",
        minLength: 2,
        maxLength: 50
    })
    department?: string;

}