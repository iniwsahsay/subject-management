import { Validator } from "../decorators/Validator";

// DTO for POST /api/auth/login
// Uses the same @Validator decorator system as SubjectDto.
// The validationMiddleware will run validateObject(req.body, LoginDto)
// before the request reaches authController.
export class LoginDto {

    @Validator({
        required: true,
        type: "string",
        email: true
    })
    email!: string;

    @Validator({
        required: true,
        type: "string",
        minLength: 1
    })
    password!: string;
}
