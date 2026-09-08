import "dotenv/config";

import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`Server started successfully on port ${PORT}`);

            console.log(`Server running at http://localhost:${PORT}`);
            console.log(
                "Swagger UI: http://localhost:3000/Subject_Management_API"
            );
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error("Failed to start server", {
                error: error.message,
                stack: error.stack
            });
        } else {
            logger.error("Failed to start server", {
                error: String(error)
            });
        }
    }
};

startServer();