import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specilaties: {
                include: {
                    speciality: true
                }
            }
        },
        where: { isDeleted: false },
    });
    return doctors;
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

export const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {

    const updatedDoctor = await prisma.doctor.update({
        where: { id },
        data: payload
    });
    return updatedDoctor;
}

const deleteDoctor = async (id: string) => {
    const deleteDoctor = await prisma.doctor.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        }
    });
    return deleteDoctor
}

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}