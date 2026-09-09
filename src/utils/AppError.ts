class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(
        message: string,
        statusCode: number,
        code: string
    ) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}


// 400 - Bad Request
class BadRequestError extends AppError {
    constructor(message: string = "Bad request") {
        super(
            message,
            400,
            "BAD_REQUEST"
        );
    }
}


// 404 - Generic Not Found
class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(
            message,
            404,
            "NOT_FOUND"
        );
    }
}


// 404 - Subject Not Found
class SubjectNotFoundError extends NotFoundError {
    constructor(subjectId: number) {
        super(
            `Subject with ID ${subjectId} not found`
        );

        this.name = "SubjectNotFoundError";
        this.code = "SUBJECT_NOT_FOUND";
    }
}


// 409 - Conflict
class ConflictError extends AppError {
    constructor(message: string = "Resource already exists") {
        super(
            message,
            409,
            "CONFLICT"
        );
    }
}


// 409 - Subject Already Exists
class SubjectAlreadyExistsError extends ConflictError {
    constructor(message: string) {
        super(message);

        this.name = "SubjectAlreadyExistsError";
        this.code = "SUBJECT_ALREADY_EXISTS";
    }
}


export {
    AppError,
    BadRequestError,
    NotFoundError,
    SubjectNotFoundError,
    ConflictError,
    SubjectAlreadyExistsError
};