class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message: string = "Bad request") {
        super(message, 400, "BAD_REQUEST");
    }
}

class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}

class ConflictError extends AppError {
    constructor(message: string = "Resource already exists") {
        super(message, 409, "CONFLICT");
    }
}

export {
    AppError,
    BadRequestError,
    NotFoundError,
    ConflictError
};