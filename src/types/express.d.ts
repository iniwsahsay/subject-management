import { JwtPayload } from "../utils/jwt";

// This file extends the Express Request type so that TypeScript knows
// req.user exists after the JWT middleware attaches it.
// Without this, TypeScript would throw: "Property 'user' does not exist on type 'Request'"
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
