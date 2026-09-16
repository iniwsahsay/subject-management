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
    ],

    // Defines the Bearer JWT security scheme.
    // This makes the Authorize button appear in Swagger UI.
    // Once you paste your token there, Swagger sends it automatically
    // on every request as: Authorization: Bearer <token>
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Paste your JWT token here (without the word Bearer — Swagger adds it automatically)"
        }
      }
    },

    // Applies Bearer auth globally to ALL endpoints by default.
    // Individual public endpoints (like /api/auth/login) override this
    // with security: [] in their own JSDoc to mark themselves as open.
    security: [
      { bearerAuth: [] }
    ]
  },

  apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
