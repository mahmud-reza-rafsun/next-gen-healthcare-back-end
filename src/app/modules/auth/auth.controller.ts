/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        console.log(payload)
        const result = await AuthService.registerPatient(payload);
        if (!result) {
            throw new AppError(status.NOT_FOUND, "Failed to register patient");
        }
        const { accessToken, refreshToken, token, ...rest } = result;

        if ('refreshToken' in result) {
            const { accessToken, refreshToken, token, ...rest } = result;

            tokenUtils.getAccessTokenCookie(res, accessToken);
            tokenUtils.getFreshTokenCookie(res, refreshToken);
            tokenUtils.setBetterAuthSessionCookies(res, token as string);
            sendResponse(res, {
                httpStatusCode: status.CREATED,
                success: true,
                message: "Patient registered successfully",
                data: { accessToken, refreshToken, token, ...rest }
            });
        }
    }
);

const loginUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.loginUser(payload);
        const { accessToken, refreshToken, token, ...rest } = result;
        tokenUtils.getAccessTokenCookie(res, accessToken);
        tokenUtils.getFreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookies(res, token);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest
            }
        })
    }
)

export const AuthController = {
    registerPatient,
    loginUser
}