import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchAbleFields = ['name', 'email', 'qualification', 'designation', 'currentWorkingPlace', 'registrationNumber', 'specilaties.speciality.speciality.title'];

export const doctorFilterAbleFields = ['appoinmentFree', 'isDeleted', 'currentWorkingPlace', 'registrationNumber', 'specilaties.speciality.specialityId', 'specilaties.speciality.title', 'experience', 'user.role', 'gender', 'qualification', 'contactNumber',];


export const doctorIncludeConfig: Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    specilaties: {
        include: {
            speciality: true
        }
    },
    appointments: {
        include: {
            patient: true,
            doctor: true,
            prescription: true,
        }
    },
    doctorSchedules: {
        include: {
            schedule: true
        }
    },
    prescriptions: true,
    reviews: true
}