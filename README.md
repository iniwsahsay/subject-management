Subject Management System APIA modular Node.js and Express RESTful API built to manage Subject resources with schema validation, custom error handling, structured logging, and Swagger API documentation.FeaturesCRUD Operations: Complete endpoints to Create, Read, Update, and Delete subject records.Request Validation: Input validation for subject attributes using custom validators.Custom Exception Handling: Centralized middleware for handling runtime and operational errors gracefully.Structured Logging: Integrated logger utility for tracking requests and system events.Interactive API Docs: Built-in Swagger UI for testing and exploring API endpoints.Subject Model AttributesAttributeTypeDescriptionsubject_idString / UUIDUnique subject identifiersubject_nameStringFull name of the subjectsubject_codeStringUnique code assigned to the subjectdescriptionStringBrief description of the course contentcreditsNumberCredit units allocated to the subjectcourse_idString / UUIDAssociated course identifierschool_idString / UUIDAssociated school or department identifierGetting StartedPrerequisitesNode.js (v14 or higher)npmInstallationClone the repository:Bashgit clone https://github.com/iniwsahsay/subject-management.git
cd subject-management
Install dependencies:Bashnpm install
Configure Environment Variables:Create a .env file in the root directory and define your configurations:Code snippetPORT=3000
NODE_ENV=development
Start the server:Development mode:Bashnpm run dev
Production mode:Bashnpm start
API DocumentationOnce the application is running, you can access the interactive Swagger documentation in your browser:Plaintexthttp://localhost:3000/api-docs
Folder StructurePlaintextsubject-management/
├── config/         # Environment and application configurations
├── controllers/    # Request handlers for Subject endpoints
├── data/           # Mock data or database access layers
├── middleware/     # Custom error handling and authentication middleware
├── models/         # Subject data models and schemas
├── routes/         # Express route definitions
├── services/       # Core business logic
├── utils/          # Logger and utility functions
├── validators/     # Request payload validation logic
├── app.js          # Express app configuration
└── server.js       # Application entry point
API Endpoints OverviewMethodEndpointDescriptionGET/api/subjectsRetrieve all subjectsGET/api/subjects/:idGet a specific subject by IDPOST/api/subjectsCreate a new subjectPUT/api/subjects/:idUpdate an existing subjectDELETE/api/subjects/:id
