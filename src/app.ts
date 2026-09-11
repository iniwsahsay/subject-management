import express, { Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import subjectRoutes from "./routes/subjectRoutes";
import swaggerSpec from "./config/swagger";
import logger from "./utils/logger";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

const app = express();

// Parse JSON request bodies — handle malformed values gracefully
app.use((req, res, next) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
        if (!data) {
            req.body = {};
            return next();
        }

        // Fix missing values like: "key": , or "key": }
        const sanitized = data
            .replace(/:\s*,/g, ": null,")
            .replace(/:\s*}/g, ": null}");

        try {
            req.body = JSON.parse(sanitized);
            return next();
        } catch {
            // Detect which specific field has an unquoted/invalid value
            const match = data.match(/"(\w+)"\s*:\s*([a-zA-Z][a-zA-Z0-9]*)/);
            const badField = match ? match[1] : null;
            const badValue = match ? match[2] : null;

            return res.status(400).json({
                status: "fail..!",
                message: "Validation failed",
                error: [{
                    field: badField ?? "request body",
                    message: badField
                        ? `${badField} has an invalid value "${badValue}" — string values must be wrapped in double quotes e.g. "${badField}": "${badValue}"`
                        : "Invalid JSON — check that all fields are correctly formatted"
                }]
            });
        }
    });
});

// HTTP request logging
app.use(
    morgan("combined", {
        stream: {
            write: (message: string) => {
                logger.info(message.trim());
            }
        }
    })
);

// Health check
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

// Swagger documentation
app.use(
    "/Subject-Management-API",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Subject routes
app.use("/api/subjects", subjectRoutes);

// Handle unknown routes
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;