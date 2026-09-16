import express, { Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";
import { validateObject } from "../validators/validationRunner";
import { LoginDto } from "../dto/AuthDto";

const router = express.Router();

// Inline validation middleware for login — same pattern as validationMiddleware.ts
function validateLogin(req: Request, res: Response, next: NextFunction): void {
    const errors = validateObject(req.body, LoginDto);
    if (errors.length > 0) {
        res.status(400).json({
            status: "fail..!",
            message: "Validation failed",
            error: errors
        });
        return;
    }
    next();
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Secret@123
 *     responses:
 *       200:
 *         description: Login successful — JWT token returned
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation failed — email or password missing/invalid
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", validateLogin, authController.login);

export default router;
