export interface SuccessResponse<T> {
    status: "true";
    message: string;
    data: T;
}

export interface ErrorResponse {
    status: "fail..!";
    message: string;
    error: string;
}

export const successResponse = <T>(message: string, data: T): SuccessResponse<T> => {
    return { status: "true", message, data };
};

export const errorResponse = (message: string, error: string): ErrorResponse => {
    return { status: "fail..!", message, error };
};
