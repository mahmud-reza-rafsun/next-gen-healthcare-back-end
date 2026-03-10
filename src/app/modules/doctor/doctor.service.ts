/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { doctorFilterAbleFields, doctorIncludeConfig, doctorSearchAbleFields } from "./doctor.constant";
import { Doctor, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interface/query.interface";

const getAllDoctors = async (query: IQueryParams) => {

    const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
        prisma.doctor,
        query,
        {
            searchableFields: doctorSearchAbleFields,
            filterableFields: doctorFilterAbleFields
        }
    )

    const result = await queryBuilder
        .search()
        .filter()
        .where({
            isDeleted: false

        })
        .include({
            user: true,
            // specilaties: true
            specilaties: {
                include: {
                    speciality: true
                }
            }
        })
        .dynamicInclude(doctorIncludeConfig)
        .paginate()
        .sort()
        .execute();
    return result;
}

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: { id, isDeleted: false },
    });

    if (!doctor) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    return doctor;
}

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: {
            id,
        }
    })

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    const { doctor: doctorData, specialties } = payload;

    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: {
                    id,
                },
                data: {
                    ...doctorData,
                }
            })
        }

        if (specialties && specialties.length > 0) {
            for (const specialty of specialties) {
                const { specialityId, shouldDelete } = specialty;
                if (shouldDelete) {
                    await tx.doctorSpeciality.delete({
                        where: {
                            doctorId_specialityId: {
                                doctorId: id,
                                specialityId,
                            }
                        }
                    })
                } else {
                    await tx.doctorSpeciality.upsert({
                        where: {
                            doctorId_specialityId: {
                                doctorId: id,
                                specialityId
                            }
                        },
                        create: {
                            doctorId: id,
                            specialityId
                        },
                        update: {}
                    });
                }
            }
        }
    })

    const doctor = await getDoctorById(id);

    return doctor;
}

//soft delete
const deleteDoctor = async (id: string) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })

        await tx.user.update({
            where: { id: isDoctorExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED // Optional: you may also want to block the user
            },
        })

        await tx.session.deleteMany({
            where: { userId: isDoctorExist.userId }
        })

        await tx.doctorSpeciality.deleteMany({
            where: { doctorId: id }
        })
    })

    return { message: "Doctor deleted successfully" };
}

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}