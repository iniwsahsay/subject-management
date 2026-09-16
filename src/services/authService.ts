import bcrypt from "bcryptjs";
import User from "../models/User";
import { signToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/AppError";
import logger from "../utils/logger";

class AuthService {

    async login(email: string, password: string): Promise<string> {
        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        // Use a generic error message for both "user not found" and "wrong password".
        // This prevents an attacker from knowing whether the email exists.
        if (!user || !user.isActive) {
            throw new UnauthorizedError("Invalid email or password");
        }

        // Compare the plain-text password against the stored bcrypt hash.
        // bcrypt.compare() returns true only if they match.
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedError("Invalid email or password");
        }

        // Build the JWT payload with all four required claims.
        // We do NOT include the password or any sensitive data here.
        const token = signToken({
            userId: user.user_id,
            tenantId: user.tenant_id,
            roles: user.roles,
            permissions: user.permissions
        });

        logger.info("User logged in successfully", {
            userId: user.user_id,
            tenantId: user.tenant_id
        });

        return token;
    }
}

export default new AuthService();
