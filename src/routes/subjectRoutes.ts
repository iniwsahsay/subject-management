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
 *         - subject_id
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
 *           type: integer
 *           example: 101
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
 *     summary: Get all subjects or search by any field
 *     tags: [Subjects]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: Mathematics
 *         description: "Search across all fields — type any value: a name (Mathematics), code (CS-DS-101), email (student@gmail.com), or a number (101, 4)"
 *     responses:
 *       200:
 *         description: Subjects Retrieved Successfully
 *       404:
 *         description: No Subjects Found
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
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Subject Found
 *       400:
 *         description: Invalid Subject ID
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
 *           type: integer
 *           example: 101
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubject'
 *     responses:
 *       200:
 *         description: Subject Updated Successfully
 *       400:
 *         description: Invalid Subject ID
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
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Subject Deleted Successfully
 *       400:
 *         description: Invalid Subject ID
 *       404:
 *         description: Subject Not Found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:subject_id", subjectController.deleteSubject);

export default router;
