import express, { Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import subjectRoutes from "./routes/subjectRoutes";
import swaggerSpec from "./config/swagger";
import logger from "./utils/logger";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

const app = express();

// Parse JSON request bodies
app.use(express.json());

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