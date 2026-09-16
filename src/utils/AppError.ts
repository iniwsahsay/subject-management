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
    constructor(subjectId: string) {
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


// 401 - Unauthorized
// Used when: token is missing, malformed, expired, invalid signature,
// or required claims (userId, tenantId, roles, permissions) are missing/invalid.
class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized") {
        super(message, 401, "UNAUTHORIZED");
    }
}


// 403 - Forbidden
// Used when: token is valid and claims are valid, but the user's
// role or permission does not allow the requested operation.
class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden") {
        super(message, 403, "FORBIDDEN");
    }
}


export {
    AppError,
    BadRequestError,
    NotFoundError,
    SubjectNotFoundError,
    ConflictError,
    SubjectAlreadyExistsError,
    UnauthorizedError,
    ForbiddenError
};