import { Request, Response, NextFunction } from "express";

import logger from "../utils/logger";
import { AppError } from "../utils/AppError";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error("Unhandled application error", {
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        stack: err.stack
    });

    // Our custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message
            }
        });
    }

    // Unexpected errors
    return res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred"
        }
    });
};

export default errorHandler;