export interface ValidatorOptions {
    required?: boolean;
    type?: "string" | "number" | "boolean";
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
}

export interface ValidationRule {
    propertyKey: string;
    options: ValidatorOptions;
}

const validationMetadata = new Map<
    Function,
    ValidationRule[]
>();

export function Validator(options: ValidatorOptions = {}) {
    return function (
        target: any,
        propertyKey: string
    ) {
        const constructor = target.constructor;

        const existingRules =
            validationMetadata.get(constructor) || [];

        existingRules.push({
            propertyKey,
            options
        });

        validationMetadata.set(
            constructor,
            existingRules
        );
    };
}

export function getValidationRules(
    target: Function
): ValidationRule[] {
    return validationMetadata.get(target) || [];
}