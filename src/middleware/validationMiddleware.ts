import { Request, Response, NextFunction } from "express";
import { validateObject } from "../validators/validationRunner";
import { SubjectDto, UpdateSubjectDto } from "../dto/SubjectDto";

function runValidation(
    constructor: Function,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validateObject(req.body, constructor);

    if (errors.length > 0) {
        return res.status(400).json({
            status: "fail..!",
            message: "Validation failed",
            error: errors
        });
    }

    next();
}

export function validateSubject(
    req: Request,
    res: Response,
    next: NextFunction
) {
    runValidation(SubjectDto, req, res, next);
}

export function validateSubjectUpdate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    runValidation(UpdateSubjectDto, req, res, next);
}