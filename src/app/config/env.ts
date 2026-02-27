import dotenv from 'dotenv';
import path from 'path';
import { EnvConfig } from './env.config.interface';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const loadEnvVariable = (): EnvConfig => {
    const requiredEnvVars = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
        "EMIAL_SENDER_SMTP_USER",
        "EMIAL_SENDER_SMTP_PASS",
        "EMIAL_SENDER_SMTP_HOST",
        "EMIAL_SENDER_SMTP_PORT",
        "EMIAL_SENDER_SMTP_FROM"
    ];

    requiredEnvVars.forEach((variable) => {
        if (!process.env[variable]) {
            throw new AppError(
                status.INTERNAL_SERVER_ERROR,
                `Environment Variable ${variable} is required but not set in .env file`
            );
        }
    });

    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        EMAIL_SENDER: {
            SMTP_USER: process.env.EMIAL_SENDER_SMTP_USER as string,
            SMTP_PASS: process.env.EMIAL_SENDER_SMTP_PASS as string,
            SMTP_HOST: process.env.EMIAL_SENDER_SMTP_HOST as string,
            SMTP_PORT: process.env.EMIAL_SENDER_SMTP_PORT as string,
            SMTP_FROM: process.env.EMIAL_SENDER_SMTP_FROM as string,
        }
    }
}

export const envVars = loadEnvVariable();