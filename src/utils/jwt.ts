import jwt from "jsonwebtoken";
import { Role, Permission } from "../models/User";

// The shape of the data we put INSIDE the JWT token.
// This is called the "payload" — it is readable by anyone who has the token,
// so we never put passwords or sensitive secrets here.
export interface JwtPayload {
    userId: string;
    tenantId: string;
    roles: Role[];
    permissions: Permission[];
}

// Read the secret from environment variables — never hard-coded.
// If JWT_SECRET is missing from .env the server will throw at startup,
// which is intentional: a missing secret is a configuration error.
function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
}

// Signs (creates) a new JWT containing the given payload.
// The token is valid for the duration set in JWT_EXPIRES_IN (e.g. "1h").
export function signToken(payload: JwtPayload): string {
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1h") as jwt.SignOptions["expiresIn"];
    return jwt.sign(payload, getSecret(), { expiresIn });
}

// Verifies a token and returns the decoded payload.
// Throws a JsonWebTokenError if the signature is wrong.
// Throws a TokenExpiredError if the token has expired.
// Both are caught and handled in authMiddleware.ts.
export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, getSecret()) as JwtPayload;
}
