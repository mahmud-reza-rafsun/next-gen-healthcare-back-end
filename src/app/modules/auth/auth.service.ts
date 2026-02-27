import status from "http-status";
import { UserStatus } from "../../../generated/prisma/browser";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IChnagePasswordPayload, ILoginUserPayload, IRegisterPatientPayload } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const registerPatient = async (payload: IRegisterPatientPayload) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            rememberMe: true
        }
    });

    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to Register Patient");
    }

    try {
        const patient = await prisma.$transaction(async (tx) => {
            const patientProfile = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email
                }
            });
            return patientProfile;
        })
        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            email: data.user.email,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        });

        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            email: data.user.email,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        });
        return {
            accessToken,
            refreshToken,
            ...data,
            patient
        };
    } catch (error) {
        console.log("Transaction Error", error);
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
    }


};

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    });

    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked. Please contact support for assistance.")
    }
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "Your account has been deleted. Please contact support for assistance.");
    }

    // create session and tokens here and return to user
    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        email: data.user.email,
        name: data.user.name,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        email: data.user.email,
        name: data.user.name,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    });

    return {
        ...data,
        accessToken,
        refreshToken
    };
}

const getMe = async (user: IRequestUser) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: user.userId
        },
        include: {
            patient: {
                include: {
                    appointments: true,
                    reviews: true,
                    prescriptions: true,
                    medicalReports: true,
                    patientHealthData: true
                }
            },
            doctor: {
                include: {
                    specilaties: true,
                    appointments: true,
                    reviews: true,
                    prescriptions: true
                }
            },
            admin: true
        }
    })

    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    return isUserExist;
}

const getNewToken = async (refreshToken: string, sessionToken: string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true,
        }
    })

    if (!isSessionTokenExists) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)


    if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const { token } = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token,
    }

}

const changePassword = async (payload: IChnagePasswordPayload, sessionToken: string) => {
    const session = await auth.api.getSession({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    });

    if (!session) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const { currentPassword, newPassword } = payload;
    const result = await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true
        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    });

    // create session and tokens here and return to user
    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    });

    return {
        ...result,
        accessToken,
        refreshToken
    };
}

const logout = async (sessionToken: string) => {
    const result = await auth.api.signOut({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    });
    return result;
}

const verifyEmail = async (email: string, otp: string) => {
    const verify = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    })
    if (verify.status && !verify.user.emailVerified) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: true
            }
        })
    }
}


const forgetPassword = async (email: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        }
    });
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User no Found!!");
    }
    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email is Not Verified")
    }
    if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User is Deleted");
    }
    await auth.api.requestPasswordResetEmailOTP({
        body: {
            email
        }
    })
}

const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User no Found!!");
    }
    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email is Not Verified")
    }
    if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User is Deleted");
    }
    await auth.api.resetPasswordEmailOTP({
        body: {
            email,
            otp,
            password: newPassword
        }
    });

    await prisma.session.deleteMany({
        where: {
            userId: isUserExist.id
        }
    })
}

export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logout,
    verifyEmail,
    forgetPassword,
    resetPassword
}