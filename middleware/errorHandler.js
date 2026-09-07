const logger = require("../utils/logger");
const { AppError } = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {

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

module.exports = errorHandler;