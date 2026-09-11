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
        const isEmpty =
            value === undefined ||
            value === null ||
            value === "" ||
            (typeof value === "string" && value.trim() === "");

        if (options.required && isEmpty) {
            errors.push({
                field: propertyKey,
                message: `${propertyKey} is empty — please provide a value for ${propertyKey}`
            });

            continue;
        }

        // Don't validate optional missing values
        if (isEmpty) {
            continue;
        }

        // Type validation
        if (options.type === "string") {

            if (typeof value !== "string") {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be a string but received ${typeof value} (${JSON.stringify(value)})`
                });

                continue;
            }
        }

        if (options.type === "number") {

            if (typeof value !== "number" || Number.isNaN(value)) {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be a number but received ${typeof value} (${JSON.stringify(value)})`
                });

                continue;
            }

            if (!Number.isInteger(value)) {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be an integer but received decimal (${value})`
                });

                continue;
            }
        }

        if (options.type === "boolean") {

            if (typeof value !== "boolean") {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be a boolean but received ${typeof value} (${JSON.stringify(value)})`
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

        // Email format validation
        if (options.email && typeof value === "string") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors.push({
                    field: propertyKey,
                    message: `${propertyKey} must be a valid email address`
                });
            }
        }

        // Pattern validation (e.g. strong password)
        if (options.pattern && typeof value === "string") {
            if (!options.pattern.test(value)) {
                errors.push({
                    field: propertyKey,
                    message: options.patternMessage ??
                        `${propertyKey} does not match the required format`
                });
            }
        }
    }

    return errors;
}