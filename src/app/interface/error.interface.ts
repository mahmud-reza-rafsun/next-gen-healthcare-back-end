export interface TErrorSourse {
    path: string;
    message: string;
}

export interface TErrorResponse {
    statusCode?: number;
    success: boolean;
    message: string;
    errorSources: TErrorSourse[];
    error?: unknown;
}