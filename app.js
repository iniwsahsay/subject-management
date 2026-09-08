const express = require("express");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const subjectRoutes = require("./routes/subjectRoutes");
const swaggerSpec = require("./config/swagger");
const logger = require("./utils/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// HTTP request logging
app.use(
    morgan("combined", {
        stream: {
            write: (message) => {
                logger.info(message.trim());
            }
        }
    })
);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

// Swagger documentation
app.use(
    "/Subject_Management_API",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Subject routes
app.use("/api/subjects", subjectRoutes);

// Handle unknown routes
app.use(notFound);

// Central error handler
app.use(errorHandler);

module.exports = app;