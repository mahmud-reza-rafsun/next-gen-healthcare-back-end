import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IAdminUpdate } from "./admin.interface";
import { IRequestUser } from "../../interface/requestUser.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllAdmin = async () => {
    return await prisma.admin.findMany({
        where: { isDeleted: false },
    });
};

const getAdminById = async (id: string) => {
    return prisma.admin.findUnique({
        where: { id, isDeleted: false },
        include: { user: true }
    });
}

const updateAdmin = async (id: string, data: IAdminUpdate) => {
    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id,
        }
    })

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
    }
    return prisma.admin.update({
        where: { id, isDeleted: false },
        data
    });
}

const deleteAdmin = async (id: string, user: IRequestUser) => {
    //TODO: Validate who is deleting the admin user. Only super admin can delete admin user and only super admin can delete super admin user but admin user cannot delete super admin user


    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id,
        }
    })

    if (!isAdminExist) {
        throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
    }

    if (isAdminExist.id === user.userId) {
        throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.admin.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })

        await tx.user.update({
            where: { id: isAdminExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED // Optional: you may also want to block the user
            },
        })

        await tx.session.deleteMany({
            where: { userId: isAdminExist.userId }
        })

        await tx.account.deleteMany({
            where: { userId: isAdminExist.userId }
        })

        const admin = await getAdminById(id);

        return admin;
    }
    )

    return result;
}


export const AdminService = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
}