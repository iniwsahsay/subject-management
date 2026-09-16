import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { successResponse } from "../utils/response";
import logger from "../utils/logger";

interface LoginRequestBody {
    email: string;
    password: string;
}

class AuthController {

    async login(
        req: Request<{}, {}, LoginRequestBody>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            logger.info("Login request received");

            const { email, password } = req.body;

            const token = await authService.login(email, password);

            res.status(200).json(
                successResponse("Login successful", { token })
            );

        } catch (error: unknown) {
            next(error);
        }
    }
}

export default new AuthController();
