# Subject Management API

A RESTful API for managing subjects using **Node.js, Express.js, TypeScript, and MongoDB**.

The API provides complete CRUD operations for subjects along with a custom `@Validator` decorator system for request validation, custom error handling, structured logging, and Swagger API documentation.

## Features

* Create a subject
* Get all subjects
* Get a subject by ID
* Update a subject
* Delete a subject
* Custom `@Validator` property decorator for declarative validation
* DTO-based validation with `SubjectDto` and `UpdateSubjectDto`
* Generic validation runner — automatically processes any decorated field
* Validation middleware wired into routes before controllers
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

| Attribute      | Type   | Required | Constraints                  | Description                |
| -------------- | ------ | -------- | ---------------------------- | -------------------------- |
| `subject_id`   | Number | Yes      | min: 1                       | Unique subject identifier  |
| `subject_name` | String | Yes      | minLength: 2, maxLength: 100 | Name of the subject        |
| `subject_code` | String | Yes      | minLength: 2, maxLength: 20  | Unique subject code        |
| `description`  | String | Yes      | maxLength: 500               | Description of the subject |
| `credits`      | Number | Yes      | min: 1, max: 10              | Number of credits          |
| `course_id`    | Number | Yes      | min: 1                       | Associated course ID       |
| `school_id`    | Number | Yes      | min: 1                       | Associated school ID       |
| `semester`     | Number | Yes      | min: 1, max: 8               | Semester number            |
| `department`   | String | Yes      | minLength: 2, maxLength: 50  | Department name            |

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
  "department": "Computer Science"
}
```

### Get All Subjects

```http
GET /api/subjects
```

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
  "department": "Computer Science"
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

| Option      | Type                              | Description                        |
| ----------- | --------------------------------- | ---------------------------------- |
| `required`  | boolean                           | Field must be present and non-empty |
| `type`      | `"string"` \| `"number"` \| `"boolean"` | Expected JavaScript type     |
| `min`       | number                            | Minimum value (for numbers)        |
| `max`       | number                            | Maximum value (for numbers)        |
| `minLength` | number                            | Minimum length (for strings)       |
| `maxLength` | number                            | Maximum length (for strings)       |

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

    @Validator({ required: true, type: "string", maxLength: 500 })
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

Example — adding `semester`:

```ts
// src/dto/SubjectDto.ts
@Validator({ required: true, type: "number", min: 1, max: 8 })
semester!: number;
```

```ts
// src/models/Subject.ts
semester: { type: Number, required: true, min: 1, max: 8 }
```

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
* `description` — required, string, maxLength: 500
* `credits` — required, number, min: 1, max: 10
* `course_id` — required, number, min: 1
* `school_id` — required, number, min: 1
* `semester` — required, number, min: 1, max: 8
* `department` — required, string, minLength: 2, maxLength: 50

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
GET     /api/subjects/:subject_id
PUT     /api/subjects/:subject_id
DELETE  /api/subjects/:subject_id
```

## Git Branch

The custom `@Validator` decorator system was implemented on `main`.

## Author

**Yashaswini S**
