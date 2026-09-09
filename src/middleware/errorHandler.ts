import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { AppError } from "../utils/AppError";
import { errorResponse } from "../utils/response";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isAppError = err instanceof AppError;

    const statusCode = isAppError
        ? err.statusCode
        : 500;

    const errorCode = isAppError
        ? err.code
        : "INTERNAL_SERVER_ERROR";

    logger.error(`Application error: ${err.message}`, {
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        errorType: err.constructor.name,
        statusCode,
        code: errorCode,
        stack: err.stack
    });

    if (isAppError) {
        return res.status(statusCode).json(
            errorResponse(
                "Request failed",
                err.message
            )
        );
    }

    return res.status(500).json(
        errorResponse(
            "Request failed",
            "An unexpected error occurred"
        )
    );
};

export default errorHandler;