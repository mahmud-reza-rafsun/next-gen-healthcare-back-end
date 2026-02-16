import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
    const specility = await prisma.speciality.create({
        data: payload
    });

    return specility;
}

const getAllSpeciality = async (): Promise<Speciality[]> => {
    const specialities = await prisma.speciality.findMany();
    return specialities;
}

const deleteSpecialty = async (id: string): Promise<Speciality> => {
    const speciality = await prisma.speciality.delete({
        where: { id }
    });
    return speciality;
}

const updateSpeciality = async (id: string, data: Partial<Speciality>): Promise<Speciality> => {
    console.log("Hello",{id, data})
    const speciality = await prisma.speciality.update({
        where: { id },
        data
    });
    return speciality;
}

export const SpecialityService = {
    createSpeciality,
    getAllSpeciality,
    deleteSpecialty,
    updateSpeciality
};