# Subject Management API

A RESTful API for managing subjects using **Node.js, Express.js, TypeScript, and MongoDB**.

The API provides complete CRUD operations for subjects along with a custom `@Validator` decorator system for request validation, custom error handling, structured logging, and Swagger API documentation.

## Features

* Create a subject
* Get all subjects
* Get all subjects with optional search/filter across all fields
* Get a subject by ID
* Update a subject
* Delete a subject
* Custom `@Validator` property decorator for declarative validation
* Supported validator options: `required`, `type`, `min`, `max`, `minLength`, `maxLength`, `email`, `pattern`, `patternMessage`
* DTO-based validation with `SubjectDto` and `UpdateSubjectDto`
* Generic validation runner — automatically processes any decorated field
* Validation middleware wired into routes before controllers
* Custom JSON body sanitizer — handles malformed values gracefully
* Custom exception handling
* Winston logging
* Morgan HTTP request logging
* Swagger/OpenAPI documentation
* MongoDB database integration
* TypeScript support with `experimentalDecorators`

## Tech Stack

* **Node.js**
* **Express.js**
* **TypeScript**
* **MongoDB**
* **Mongoose**
* **Swagger / OpenAPI**
* **Winston**
* **Morgan**
* **dotenv**

## Project Structure

```text
subject-management/
│
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── swagger.ts
│   │
│   ├── controllers/
│   │   └── subjectController.ts
│   │
│   ├── decorators/
│   │   └── Validator.ts
│   │
│   ├── dto/
│   │   └── SubjectDto.ts
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   └── validationMiddleware.ts
│   │
│   ├── models/
│   │   └── Subject.ts
│   │
│   ├── routes/
│   │   └── subjectRoutes.ts
│   │
│   ├── services/
│   │   └── subjectService.ts
│   │
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── logger.ts
│   │   └── response.ts
│   │
│   ├── validators/
│   │   ├── subjectValidator.ts
│   │   └── validationRunner.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Subject Attributes

| Attribute      | Type   | Required | Constraints                                                                 | Description                |
| -------------- | ------ | -------- | --------------------------------------------------------------------------- | -------------------------- |
| `subject_id`   | Number | Yes      | min: 1                                                                      | Unique subject identifier  |
| `subject_name` | String | Yes      | minLength: 2, maxLength: 100                                                | Name of the subject        |
| `subject_code` | String | Yes      | minLength: 2, maxLength: 20                                                 | Unique subject code        |
| `description`  | String | Yes      | minLength: 10, maxLength: 500                                               | Description of the subject |
| `credits`      | Number | Yes      | min: 1, max: 10                                                             | Number of credits          |
| `course_id`    | Number | Yes      | min: 1                                                                      | Associated course ID       |
| `school_id`    | Number | Yes      | min: 1                                                                      | Associated school ID       |
| `semester`     | Number | Yes      | min: 1, max: 8                                                              | Semester number            |
| `department`   | String | Yes      | minLength: 2, maxLength: 50                                                 | Department name            |
| `email`        | String | Yes      | valid email format                                                          | Contact email address      |
| `password`     | String | Yes      | min 8 chars, uppercase, lowercase, number, special character (@#$%!)       | Account password           |

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB

## Installation

Clone the repository:

```bash
git clone https://github.com/iniwsahsay/subject-management.git
```

Navigate to the project:

```bash
cd subject-management
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection string.

## Run the Project

### Development

Compile the TypeScript code and start the server:

```bash
npm run dev
```

### Build

Compile TypeScript into JavaScript:

```bash
npm run build
```

The compiled files are generated inside the `dist/` directory.

### Production

Start the compiled application:

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

## API Endpoints

### Create Subject

```http
POST /api/subjects
```

Example request:

```json
{
  "subject_id": 101,
  "subject_name": "Data Structures and Algorithms",
  "subject_code": "CS-DSA-101",
  "description": "Study of data structures, algorithms, and problem-solving techniques.",
  "credits": 4,
  "course_id": 10,
  "school_id": 1,
  "semester": 3,
  "department": "Computer Science",
  "email": "student@gmail.com",
  "password": "Secret@123"
}
```

### Get All Subjects

```http
GET /api/subjects
```

Returns all subjects sorted by creation date (newest first).

### Search Subjects

```http
GET /api/subjects?search=<value>
```

Uses the existing GET all subjects endpoint with an optional `search` query parameter. Searches across all 11 subject fields simultaneously.

If `search` is not provided, all subjects are returned as usual.

Examples:

```http
GET /api/subjects?search=Mathematics
GET /api/subjects?search=CS-DSA-101
GET /api/subjects?search=Computer
GET /api/subjects?search=student@gmail.com
GET /api/subjects?search=101
GET /api/subjects?search=4
```

Search behavior:
- String fields (`subject_name`, `subject_code`, `description`, `department`, `email`, `password`) — case-insensitive partial match
- Numeric fields (`subject_id`, `credits`, `course_id`, `school_id`, `semester`) — exact match when the search value is a valid number

### Get Subject by ID

```http
GET /api/subjects/:subject_id
```

Example:

```http
GET /api/subjects/101
```

### Update Subject

```http
PUT /api/subjects/:subject_id
```

Example:

```http
PUT /api/subjects/101
```

Request body (all fields optional):

```json
{
  "subject_name": "Advanced Data Structures and Algorithms",
  "credits": 5,
  "semester": 4,
  "department": "Computer Science",
  "email": "updated@gmail.com",
  "password": "NewPass@123"
}
```

### Delete Subject

```http
DELETE /api/subjects/:subject_id
```

Example:

```http
DELETE /api/subjects/101
```

## Custom @Validator Decorator

The project uses a custom TypeScript property decorator `@Validator` to define validation rules directly on DTO fields.

### How it works

`@Validator` stores validation rules in a metadata `Map` keyed by the class constructor at class-load time.

```ts
@Validator({
    required: true,
    type: "number",
    min: 1,
    max: 8
})
semester!: number;
```

The generic `validateObject` runner in `src/validators/validationRunner.ts` reads the metadata and validates every decorated field automatically — no field-specific `if` statements needed anywhere.

### Supported validation options

| Option           | Type                                    | Description                                              |
| ---------------- | --------------------------------------- | -------------------------------------------------------- |
| `required`       | boolean                                 | Field must be present and non-empty                      |
| `type`           | `"string"` \| `"number"` \| `"boolean"` | Expected JavaScript type                                 |
| `min`            | number                                  | Minimum value (for numbers)                              |
| `max`            | number                                  | Maximum value (for numbers)                              |
| `minLength`      | number                                  | Minimum length (for strings)                             |
| `maxLength`      | number                                  | Maximum length (for strings)                             |
| `email`          | boolean                                 | Validates email format using regex                       |
| `pattern`        | RegExp                                  | Custom regex pattern the value must match                |
| `patternMessage` | string                                  | Custom error message shown when `pattern` validation fails |

### DTOs

`SubjectDto` — used for create (all fields required):

```ts
export class SubjectDto {

    @Validator({ required: true, type: "number", min: 1 })
    subject_id!: number;

    @Validator({ required: true, type: "string", minLength: 2, maxLength: 100 })
    subject_name!: string;

    @Validator({ required: true, type: "string", minLength: 2, maxLength: 20 })
    subject_code!: string;

    @Validator({ required: true, type: "string", minLength: 10, maxLength: 500 })
    description!: string;

    @Validator({ required: true, type: "number", min: 1, max: 10 })
    credits!: number;

    @Validator({ required: true, type: "number", min: 1 })
    course_id!: number;

    @Validator({ required: true, type: "number", min: 1 })
    school_id!: number;

    @Validator({ required: true, type: "number", min: 1, max: 8 })
    semester!: number;

    @Validator({ required: true, type: "string", minLength: 2, maxLength: 50 })
    department!: string;

    @Validator({ required: true, type: "string", email: true })
    email!: string;

    @Validator({
        required: true,
        type: "string",
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!])[A-Za-z\d@#$%!]{8,}$/,
        patternMessage: "password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    })
    password!: string;
}
```

`UpdateSubjectDto` — used for update (all fields optional):

```ts
export class UpdateSubjectDto {

    @Validator({ required: false, type: "string", minLength: 2, maxLength: 100 })
    subject_name?: string;

    @Validator({ required: false, type: "string", minLength: 2, maxLength: 20 })
    subject_code?: string;

    @Validator({ required: false, type: "string", maxLength: 500 })
    description?: string;

    @Validator({ required: false, type: "number", min: 1, max: 10 })
    credits?: number;

    @Validator({ required: false, type: "number", min: 1 })
    course_id?: number;

    @Validator({ required: false, type: "number", min: 1 })
    school_id?: number;

    @Validator({ required: false, type: "number", min: 1, max: 8 })
    semester?: number;

    @Validator({ required: false, type: "string", minLength: 2, maxLength: 50 })
    department?: string;

    @Validator({ required: false, type: "string", email: true })
    email?: string;

    @Validator({
        required: false,
        type: "string",
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!])[A-Za-z\d@#$%!]{8,}$/,
        patternMessage: "password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    })
    password?: string;
}
```

### Adding a new attribute

To add a new field to the subject, only **4 files** need to be updated:

| File | What to add |
| ---- | ----------- |
| `src/dto/SubjectDto.ts` | `@Validator` in both `SubjectDto` and `UpdateSubjectDto` |
| `src/models/Subject.ts` | Field in interface and schema |
| `src/services/subjectService.ts` | Field in both interfaces, destructuring, and `Subject.create()` |
| `src/controllers/subjectController.ts` | Field in both request body interfaces |

No changes needed to routes, middleware, or the validation runner.

Then rebuild:

```bash
npm run build
npm start
```

## Swagger Documentation

Interactive API documentation is available through Swagger UI:

```text
http://localhost:3000/Subject-Management-API
```

Swagger allows you to view and test all available API endpoints directly from the browser.

The Swagger schema includes two separate schemas:
- `Subject` — used for POST, contains all 11 required fields
- `UpdateSubject` — used for PUT, contains all updatable fields (all optional, no `subject_id`)

## Health Check

The application provides a health-check endpoint:

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

## Response Format

### Success

```json
{
  "status": "true",
  "message": "success",
  "data": {}
}
```

### Failure

```json
{
  "status": "fail..!",
  "message": "",
  "error": ""
}
```

### Validation failure

```json
{
  "status": "fail..!",
  "message": "Validation failed",
  "error": [
    {
      "field": "credits",
      "message": "credits must be at least 1"
    }
  ]
}
```

## Error Handling

The API uses custom error classes for common application errors:

* `400 Bad Request` — invalid input or validation failure
* `404 Not Found` — subject not found
* `409 Conflict` — subject ID or code already exists
* `500 Internal Server Error` — unexpected error

Custom error classes in `src/utils/AppError.ts`:

* `AppError` — base class
* `BadRequestError` — 400
* `NotFoundError` — 404
* `SubjectNotFoundError` — 404 (subject-specific)
* `ConflictError` — 409
* `SubjectAlreadyExistsError` — 409 (subject-specific)

The application also includes a custom JSON body sanitizer in `src/app.ts` that handles malformed request bodies gracefully — for example, missing values (`"key": ,`) or unquoted string values — and returns a descriptive `400` validation error instead of crashing.

## Logging

The application uses **Winston** for structured logging and **Morgan** for HTTP request logging.

Logs are stored locally in:

```text
logs/application.log
logs/error.log
```

The `logs/` directory is excluded from Git using `.gitignore`.

## Validation

Validation is handled by the `@Validator` decorator system before the request reaches the controller.

Route flow:

```text
POST /api/subjects  →  validateSubject middleware  →  subjectController.createSubject
PUT  /api/subjects/:id  →  validateSubjectUpdate middleware  →  subjectController.updateSubject
```

Validation rules per field:

* `subject_id` — required, number, min: 1
* `subject_name` — required, string, minLength: 2, maxLength: 100
* `subject_code` — required, string, minLength: 2, maxLength: 20
* `description` — required, string, minLength: 10, maxLength: 500
* `credits` — required, number, min: 1, max: 10
* `course_id` — required, number, min: 1
* `school_id` — required, number, min: 1
* `semester` — required, number, min: 1, max: 8
* `department` — required, string, minLength: 2, maxLength: 50
* `email` — required, string, valid email format
* `password` — required, string, min 8 characters, must include uppercase, lowercase, number, and special character (`@#$%!`)

## TypeScript

The project is written in TypeScript with `experimentalDecorators` enabled to support the custom `@Validator` decorator.

TypeScript configuration is maintained in:

```text
tsconfig.json
```

Source files are located in:

```text
src/
```

Compiled JavaScript files are generated in:

```text
dist/
```

The `dist/` directory is excluded from Git because it is generated during the build process.

## Testing

The API can be tested using:

* Postman
* Swagger UI at `http://localhost:3000/Subject-Management-API`

Example CRUD flow:

```text
POST    /api/subjects
GET     /api/subjects
GET     /api/subjects?search=Mathematics
GET     /api/subjects/:subject_id
PUT     /api/subjects/:subject_id
DELETE  /api/subjects/:subject_id
```

## Git Branch

The custom `@Validator` decorator system, `email`/`password` fields, search functionality, and Swagger schema updates were all implemented on `main`.

## Author

**Yashaswini S**
