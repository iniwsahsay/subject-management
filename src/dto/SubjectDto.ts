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
        minLength: 10,
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

    @Validator({
        required: true,
        type: "string",
        email: true
    })
    email!: string;

    @Validator({
        required: true,
        type: "string",
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!])[A-Za-z\d@#$%!]{8,}$/,
        patternMessage: "password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    })
    password!: string;

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

    @Validator({
        required: false,
        type: "string",
        email: true
    })
    email?: string;

    @Validator({
        required: false,
        type: "string",
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!])[A-Za-z\d@#$%!]{8,}$/,
        patternMessage: "password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    })
    password?: string;

}