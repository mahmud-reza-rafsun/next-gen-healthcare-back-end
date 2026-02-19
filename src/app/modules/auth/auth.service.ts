import { UserStatus } from "../../../generated/prisma/browser";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
    name: string,
    email: string,
    password: string
}

export const registerPatient = async (payload: IRegisterPatientPayload) => {
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
        throw new Error("Failed to Register Patient");
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
        return {
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

interface ILoginUserPayload {
    email: string,
    password: string
}

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    });

    if (data.user.status === UserStatus.BLOCKED) {
        throw new Error("Your account has been blocked. Please contact support for assistance.");
    }
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new Error("Your account has been deleted. Please contact support for assistance.");
    }
    return data;
}
export const AuthService = {
    registerPatient,
    loginUser
}