const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Subject Management API",
            version: "1.0.0",
            description: "REST API for managing subjects"
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ]
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;