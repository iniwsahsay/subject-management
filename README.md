# Subject Management API

A RESTful API for managing subjects using **Node.js, Express.js, TypeScript, and MongoDB**.

The API provides complete CRUD operations for subjects along with a custom `@Validator` decorator system for request validation, custom error handling, structured logging, and Swagger API documentation.

## Features

* Create a subject (UUID auto-generated for `subject_id`)
* Get all subjects
* Get all subjects with pagination
* Filter subjects by a specific field and value
* Get a subject by ID
* Update a subject
* Delete a subject
* Custom `@Validator` property decorator for declarative validation
* Supported validator options: `required`, `type`, `min`, `max`, `minLength`, `maxLength`, `email`, `pattern`, `patternMessage`
* DTO-based validation with `SubjectDto` and `UpdateSubjectDto`
* Generic validation runner — automatically processes any decorated field
* Validation middleware wired into routes before controllers
* Datatype validation for filter queries — rejects wrong types before hitting the database
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
* **uuid**
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

| Attribute      | Type   | Source        | Constraints                                                           | Description                |
| -------------- | ------ | ------------- | --------------------------------------------------------------------- | -------------------------- |
| `subject_id`   | String | Auto-generated | UUID v4, unique                                                      | Unique subject identifier  |
| `subject_name` | String | Client        | required, minLength: 2, maxLength: 100                                | Name of the subject        |
| `subject_code` | String | Client        | required, minLength: 2, maxLength: 20, unique                         | Unique subject code        |
| `description`  | String | Client        | required, minLength: 10, maxLength: 500                               | Description of the subject |
| `credits`      | Number | Client        | required, min: 1, max: 10                                             | Number of credits          |
| `course_id`    | Number | Client        | required, min: 1                                                      | Associated course ID       |
| `school_id`    | Number | Client        | required, min: 1                                                      | Associated school ID       |
| `semester`     | Number | Client        | required, min: 1, max: 8                                              | Semester number            |
| `department`   | String | Client        | required, minLength: 2, maxLength: 50                                 | Department name            |
| `email`        | String | Client        | required, valid email format                                          | Contact email address      |
| `password`     | String | Client        | required, min 8 chars, uppercase, lowercase, number, special char     | Account password           |

> `subject_id` is automatically generated as a UUID v4 on the server. Do not include it in the POST request body.

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

Do **not** include `subject_id` in the request body — it is auto-generated as a UUID v4.

Example request:

```json
{
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

Example response:

```json
{
  "status": "true",
  "message": "success",
  "data": {
    "subject_id": "550e8400-e29b-41d4-a716-446655440000",
    "subject_name": "Data Structures and Algorithms",
    ...
  }
}
```

### Get All Subjects

```http
GET /api/subjects
```

Returns subjects sorted by creation date (newest first), paginated. Defaults to page 1 with 10 subjects per page.

### Pagination

```http
GET /api/subjects?page=<number>&limit=<number>
```

| Parameter | Type    | Default | Description                       |
| --------- | ------- | ------- | --------------------------------- |
| `page`    | integer | 1       | Page number (must be ≥ 1)         |
| `limit`   | integer | 10      | Number of subjects per page (≥ 1) |

Examples:

```http
GET /api/subjects
GET /api/subjects?page=1&limit=10
GET /api/subjects?page=2&limit=5
GET /api/subjects?page=3&limit=20
```

Pagination response:

```json
{
  "status": "true",
  "message": "Subjects fetched successfully",
  "data": {
    "subjects": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 25,
      "totalPages": 3
    }
  }
}
```

Pagination behavior:
- `skip` is calculated as `(page - 1) * limit`
- `totalPages` is calculated as `Math.ceil(totalItems / limit)`
- Requesting a page beyond available data returns an empty `subjects` array with a `200` status
- Invalid `page` or `limit` values return a `400` validation error

### Filter Subjects

```http
GET /api/subjects?field=<attribute>&value=<search_value>
```

Filters subjects by a specific attribute. Both `field` and `value` must be provided together.

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `field`   | string | The subject attribute to filter by (see allowed fields below) |
| `value`   | string | The value to search for in the specified field   |

Allowed fields:

```text
subject_id, subject_name, subject_code, description, credits,
course_id, school_id, semester, department, email, password
```

Filter behavior:
- **String fields** (`subject_name`, `subject_code`, `description`, `department`, `email`, `password`, `subject_id`) — case-insensitive prefix match. `math` matches `math`, `maths`, `mathematics`, `math department`
- **Numeric fields** (`credits`, `course_id`, `school_id`, `semester`) — exact number match

Datatype validation:
- Providing a numeric value for a string field returns a `400` error
- Providing a non-numeric value for a numeric field returns a `400` error
- The database is never queried on invalid input

Examples:

```http
GET /api/subjects?field=subject_name&value=math
GET /api/subjects?field=subject_code&value=CS
GET /api/subjects?field=department&value=computer
GET /api/subjects?field=credits&value=4
GET /api/subjects?field=subject_id&value=550e8400
GET /api/subjects?field=subject_name&value=math&page=1&limit=5
```

Filter + pagination response:

```json
{
  "status": "true",
  "message": "Subjects fetched successfully",
  "data": {
    "subjects": [],
    "pagination": {
      "page": 1,
      "limit": 5,
      "totalItems": 3,
      "totalPages": 1
    }
  }
}
```

Invalid field response:

```json
{
  "status": "fail..!",
  "message": "Validation failed",
  "error": [
    {
      "field": "field",
      "message": "'abc' is not a valid subject field. Allowed fields: subject_id, subject_name, ..."
    }
  ]
}
```

Invalid datatype response:

```json
{
  "status": "fail..!",
  "message": "Invalid datatype",
  "error": "Invalid value for credits. Expected a number. Please provide a numeric value."
}
```

### Get Subject by ID

```http
GET /api/subjects/:subject_id
```

`:subject_id` is the UUID generated at creation time.

Example:

```http
GET /api/subjects/550e8400-e29b-41d4-a716-446655440000
```

### Update Subject

```http
PUT /api/subjects/:subject_id
```

Example:

```http
PUT /api/subjects/550e8400-e29b-41d4-a716-446655440000
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
DELETE /api/subjects/550e8400-e29b-41d4-a716-446655440000
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

| Option           | Type                                    | Description                                                |
| ---------------- | --------------------------------------- | ---------------------------------------------------------- |
| `required`       | boolean                                 | Field must be present and non-empty                        |
| `type`           | `"string"` \| `"number"` \| `"boolean"` | Expected JavaScript type                                   |
| `min`            | number                                  | Minimum value (for numbers)                                |
| `max`            | number                                  | Maximum value (for numbers)                                |
| `minLength`      | number                                  | Minimum length (for strings)                               |
| `maxLength`      | number                                  | Maximum length (for strings)                               |
| `email`          | boolean                                 | Validates email format using regex                         |
| `pattern`        | RegExp                                  | Custom regex pattern the value must match                  |
| `patternMessage` | string                                  | Custom error message shown when `pattern` validation fails |

### DTOs

`SubjectDto` — used for create (`subject_id` excluded — auto-generated):

```ts
export class SubjectDto {

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
- `Subject` — used for POST, contains all 10 client-provided fields (`subject_id` is `readOnly`)
- `UpdateSubject` — used for PUT, contains all updatable fields (all optional)

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

* `400 Bad Request` — invalid input, validation failure, or wrong datatype in filter
* `404 Not Found` — subject not found or no filter results
* `409 Conflict` — subject code already exists
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
POST /api/subjects      →  validateSubject middleware       →  subjectController.createSubject
PUT  /api/subjects/:id  →  validateSubjectUpdate middleware  →  subjectController.updateSubject
```

Validation rules per field (POST):

* `subject_id` — auto-generated UUID, not validated from client input
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
GET     /api/subjects?page=1&limit=10
GET     /api/subjects?page=2&limit=5
GET     /api/subjects?field=subject_name&value=math
GET     /api/subjects?field=credits&value=4
GET     /api/subjects?field=subject_name&value=math&page=1&limit=5
GET     /api/subjects/:subject_id
PUT     /api/subjects/:subject_id
DELETE  /api/subjects/:subject_id
```

## Git Branch

All features including the custom `@Validator` decorator system, `email`/`password` fields, field+value filter with datatype validation, pagination, UUID auto-generation for `subject_id`, and Swagger schema updates were implemented on `main`.

## Author

**Yashaswini S**
