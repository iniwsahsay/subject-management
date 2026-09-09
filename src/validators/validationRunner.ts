import {
    getValidationRules,
    ValidationRule
} from "../decorators/Validator";

export interface ValidationError {
    field: string;
    message: string;
}

export function validateObject(
    object: any,
    constructor: Function
): ValidationError[] {

    const rules: ValidationRule[] =
        getValidationRules(constructor);

    const errors: ValidationError[] = [];

    for (const rule of rules) {

        const {
            propertyKey,
            options
        } = rule;

        const value = object[propertyKey];

        // Required validation
        if (
            options.required &&
            (
                value === undefined ||
                value === null ||
                value === ""
            )
        ) {
            errors.push({
                field: propertyKey,
                message: `${propertyKey} is required`
            });

            continue;
        }

        // Don't validate optional missing values
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            continue;
        }

        // Type validation
        if (options.type === "string") {

            if (typeof value !== "string") {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be a string`
                });

                continue;
            }
        }

        if (options.type === "number") {

            if (
                typeof value !== "number" ||
                Number.isNaN(value)
            ) {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be a number`
                });

                continue;
            }
        }

        if (options.type === "boolean") {

            if (typeof value !== "boolean") {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be a boolean`
                });

                continue;
            }
        }

        // Number minimum
        if (
            options.min !== undefined &&
            typeof value === "number" &&
            value < options.min
        ) {
            errors.push({
                field: propertyKey,
                message: `${propertyKey} must be at least ${options.min}`
            });
        }

        // Number maximum
        if (
            options.max !== undefined &&
            typeof value === "number" &&
            value > options.max
        ) {
            errors.push({
                field: propertyKey,
                message: `${propertyKey} cannot exceed ${options.max}`
            });
        }

        // String minimum length
        if (
            options.minLength !== undefined &&
            typeof value === "string" &&
            value.length < options.minLength
        ) {
            errors.push({
                field: propertyKey,
                message:
                    `${propertyKey} must be at least ${options.minLength} characters`
            });
        }

        // String maximum length
        if (
            options.maxLength !== undefined &&
            typeof value === "string" &&
            value.length > options.maxLength
        ) {
            errors.push({
                field: propertyKey,
                message:
                    `${propertyKey} cannot exceed ${options.maxLength} characters`
            });
        }
    }

    return errors;
}