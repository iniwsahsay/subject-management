const express = require("express");

const subjectController = require("../controllers/subjectController");

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
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *           example: 68c123abc456789def012345
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
 *           example: 101
 *         school_id:
 *           type: integer
 *           example: 10
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
 *         description: Subject created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Subject code already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", subjectController.createSubject);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: List of all subjects
 *       500:
 *         description: Internal server error
 */
router.get("/", subjectController.getAllSubjects);

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Get a subject by MongoDB ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123abc456789def012345
 *     responses:
 *       200:
 *         description: Subject found
 *       400:
 *         description: Invalid subject ID
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", subjectController.getSubjectById);

/**
 * @swagger
 * /api/subjects/{id}:
 *   put:
 *     summary: Update a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123abc456789def012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Subject not found
 *       409:
 *         description: Subject code already exists
 *       500:
 *         description: Internal server error
 */
router.put("/:id", subjectController.updateSubject);

/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123abc456789def012345
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       400:
 *         description: Invalid subject ID
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", subjectController.deleteSubject);

module.exports = router;