import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
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

    apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;