import winston from "winston";

const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    transports: [
        // Display logs in terminal
        new winston.transports.Console(),

        // Store errors separately
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),

        // Store all application logs
        new winston.transports.File({
            filename: "logs/application.log"
        })
    ]
});

export default logger;