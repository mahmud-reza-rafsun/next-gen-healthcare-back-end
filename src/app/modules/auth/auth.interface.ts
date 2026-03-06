export interface IRegisterPatientPayload {
    name: string,
    email: string,
    password: string
}

export interface ILoginUserPayload {
    email: string,
    password: string
}

export interface IChnagePasswordPayload {
    currentPassword: string,
    newPassword: string
}

interface SessionData {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
}

interface UserData {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    role: string;
    status: string;
    needPasswordChange: boolean;
    isDeleted: boolean;
}

export type IUseSession = {
    session: SessionData;
    user: UserData;
} | null;

