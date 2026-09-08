# Subject Management API

A RESTful API for managing subjects using **Node.js, Express.js, TypeScript, and MongoDB**.

The API provides complete CRUD operations for subjects along with request validation, custom error handling, structured logging, and Swagger API documentation.

## Features

* Create a subject
* Get all subjects
* Get a subject by ID
* Update a subject
* Delete a subject
* Request validation
* Custom exception handling
* Winston logging
* Morgan HTTP request logging
* Swagger/OpenAPI documentation
* MongoDB database integration
* TypeScript support

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
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── notFound.ts
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
│   │   └── logger.ts
│   │
│   ├── validators/
│   │   └── subjectValidator.ts
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

| Attribute      | Type   | Description                |
| -------------- | ------ | -------------------------- |
| `subject_id`   | Number | Unique subject identifier  |
| `subject_name` | String | Name of the subject        |
| `subject_code` | String | Unique subject code        |
| `description`  | String | Description of the subject |
| `credits`      | Number | Number of credits          |
| `course_id`    | Number | Associated course ID       |
| `school_id`    | Number | Associated school ID       |

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
  "school_id": 1
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

Request body:

```json
{
  "subject_name": "Advanced Data Structures and Algorithms",
  "subject_code": "CS-DSA-101",
  "description": "Advanced study of data structures and algorithms.",
  "credits": 5,
  "course_id": 10,
  "school_id": 1
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

## Swagger Documentation

Interactive API documentation is available through Swagger UI:

```text
http://localhost:3000/Subject_Management_API
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

## Error Handling

The API uses custom error classes for common application errors:

* `400 Bad Request`
* `404 Not Found`
* `409 Conflict`
* `500 Internal Server Error`

Example error response:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Subject not found"
  }
}
```

## Logging

The application uses **Winston** for structured logging and **Morgan** for HTTP request logging.

Logs are stored locally in:

```text
logs/application.log
logs/error.log
```

The `logs/` directory is excluded from Git using `.gitignore`.

## Validation

The API validates incoming subject data before processing requests.

Examples of validation rules:

* `subject_id` must be a positive integer
* `subject_name` must be a non-empty string
* `subject_code` must be a non-empty string
* `description` must be a non-empty string
* `credits` must be a positive integer
* `course_id` must be a positive integer
* `school_id` must be a positive integer

## TypeScript

The project is written in TypeScript.

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
* Swagger UI

Example CRUD flow:

```text
POST    /api/subjects
GET     /api/subjects
GET     /api/subjects/:subject_id
PUT     /api/subjects/:subject_id
DELETE  /api/subjects/:subject_id
```

## Git Branch

The TypeScript migration was implemented on:

```text
add-subject-id
```

and merged into:

```text
main
```

## Author

**Yashaswini S**
