/* eslint-disable @typescript-eslint/no-unused-expressions */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { status } from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSourse } from "../interface/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error from Global Error Handler", err)
    }

    let errorSources: TErrorSourse[] = [];
    let statusCode: number = status.INTERNAL_SERVER_ERROR
    let message: string = `Internal Server Error`
    let stack: string | undefined = undefined

    if (err instanceof z.ZodError) {
        const simplefiedError = handleZodError(err)
        statusCode = simplefiedError.statusCode as number
        message = simplefiedError.message
        errorSources = [...simplefiedError.errorSources]
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ]
    }
    else if (err instanceof Error) {
        statusCode = status.BAD_REQUEST
        message = err.message
        stack = err.stack;
        errorSources = [
            {
                path: '',
                message: err.message
            }
        ]
    }

    const errorResponse: TErrorResponse = {
        success: false,
        message,
        errorSources,
        stack: envVars.NODE_ENV === "development" ? stack : undefined,
        error: envVars.NODE_ENV === "development" ? err : undefined
    }
    res.status(statusCode).json(errorResponse);
};