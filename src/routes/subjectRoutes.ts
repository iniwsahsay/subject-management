import express from "express";
import subjectController from "../controllers/subjectController";
import {
    validateSubject,
    validateSubjectUpdate
} from "../middleware/validationMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       required:
 *         - subject_name
 *         - subject_code
 *         - description
 *         - credits
 *         - course_id
 *         - school_id
 *         - semester
 *         - department
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *           example: 68c123abc456789def012345
 *         subject_id:
 *           type: string
 *           readOnly: true
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         subject_name:
 *           type: string
 *           example: Mathematics
 *         subject_code:
 *           type: string
 *           example: MATH101
 *         description:
 *           type: string
 *           example: Introduction to Mathematics
 *         credits:
 *           type: integer
 *           example: 4
 *         course_id:
 *           type: integer
 *           example: 10
 *         school_id:
 *           type: integer
 *           example: 1
 *         semester:
 *           type: integer
 *           example: 3
 *         department:
 *           type: string
 *           example: Computer Science
 *         email:
 *           type: string
 *           example: student@gmail.com
 *         password:
 *           type: string
 *           example: secret123
 *     UpdateSubject:
 *       type: object
 *       properties:
 *         subject_name:
 *           type: string
 *           example: Mathematics
 *         subject_code:
 *           type: string
 *           example: MATH101
 *         description:
 *           type: string
 *           example: Introduction to Mathematics
 *         credits:
 *           type: integer
 *           example: 4
 *         course_id:
 *           type: integer
 *           example: 10
 *         school_id:
 *           type: integer
 *           example: 1
 *         semester:
 *           type: integer
 *           example: 3
 *         department:
 *           type: string
 *           example: Computer Science
 *         email:
 *           type: string
 *           example: student@gmail.com
 *         password:
 *           type: string
 *           example: secret123
 */

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: Subject Created Successfully
 *       400:
 *         description: Invalid Subject Data
 *       409:
 *         description: Subject ID or Code Already Exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/", validateSubject, subjectController.createSubject);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects (paginated) or filter by a specific field
 *     tags: [Subjects]
 *     parameters:
 *       - in: query
 *         name: field
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - subject_id
 *             - subject_name
 *             - subject_code
 *             - description
 *             - credits
 *             - course_id
 *             - school_id
 *             - semester
 *             - department
 *             - email
 *             - password
 *           example: subject_name
 *         description: "Subject attribute to filter by. Note: subject_id expects a UUID string value."
 *       - in: query
 *         name: value
 *         required: false
 *         schema:
 *           type: string
 *           example: math
 *         description: "Value to search for — must match the datatype of the selected field."
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *         description: "Page number (default: 1). Must be a positive integer."
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *         description: "Number of subjects per page (default: 10). Must be a positive integer."
 *     responses:
 *       200:
 *         description: Subjects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "true"
 *                 message:
 *                   type: string
 *                   example: Subjects fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     subjects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Subject'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 25
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *       400:
 *         description: "Invalid field name, missing/empty value, wrong datatype (e.g. text for a numeric field or number for a string field), or invalid pagination"
 *       404:
 *         description: No subjects found matching the filter
 *       500:
 *         description: Internal Server Error
 */
router.get("/", subjectController.getAllSubjects);

/**
 * @swagger
 * /api/subjects/{subject_id}:
 *   get:
 *     summary: Get a subject by subject ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: subject_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Subject Found
 *       404:
 *         description: Subject Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:subject_id", subjectController.getSubjectById);

/**
 * @swagger
 * /api/subjects/{subject_id}:
 *   put:
 *     summary: Update a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: subject_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubject'
 *     responses:
 *       200:
 *         description: Subject Updated Successfully
 *       404:
 *         description: Subject Not Found
 *       409:
 *         description: Subject Code Already Exists
 *       500:
 *         description: Internal Server Error
 */
router.put("/:subject_id", validateSubjectUpdate, subjectController.updateSubject);

/**
 * @swagger
 * /api/subjects/{subject_id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: subject_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Subject Deleted Successfully
 *       404:
 *         description: Subject Not Found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:subject_id", subjectController.deleteSubject);

export default router;
