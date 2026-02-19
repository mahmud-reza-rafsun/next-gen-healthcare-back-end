import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
    password: z.string("Password is Required").min(8, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
    doctor: z.object({
        name: z.string("Name is Required").min(5, "Name must be at least 5 characters long").max(30, "Name must be at most 30 characters long"),
        email: z.email("Invalid email address"),
        contactNumber: z.string("Contact Number is Required").min(11, "Contact Number must be at least 11 characters long").max(14, "Contact Number must be at most 14 characters long"),
        address: z.string("Address is Required").min(10, "Address must be at least 5 characters long").max(100, "Address must be at most 100 characters long").optional(),
        registrationNumber: z.string("Registration Number is Required"),
        experience: z.number("Experience is Required").nonnegative("Experience must be a non-negative number").optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appoinmentFee: z.number("Appointment Fee is Required").nonnegative(),
        qualification: z.string("Qualification is Required").min(2, "Qualification must be at least 2 characters long").max(50, "Qualification must be at most 50 characters long"),
        currentWorkingPlace: z.string("Current Working Place is Required").min(2, "Current Working Place must be at least 2 characters long").max(50, "Current Working Place must be at most 50 characters long"),
        designation: z.string("Designation is Required").min(2, "Designation must be at least 2 characters long").max(50, "Designation must be at most 50 characters long"),
    }),
    specilaties: z.array(z.uuid("Speciality must be an array of string").min(1, "At least one speciality is required"))
}); 