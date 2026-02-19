import dotenv from 'dotenv';
import { EnvConfig } from './env.config.interface';

dotenv.config();

const loadEnvVariable = (): EnvConfig => {
    const loadEnvVariable = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
    ];
    loadEnvVariable.forEach((variable) => {
        if (!process.env[variable]) {
            throw new Error(`Environment Variable ${variable} is required but not set in .env file`);
        }
    });

    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string
    }
}

export const envVars = loadEnvVariable();