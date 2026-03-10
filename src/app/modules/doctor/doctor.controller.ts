import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IQueryParams } from "../../interface/query.interface";

const getAllDoctors = catchAsync(
    async (req: Request, res: Response) => {
        // use the full query object and assert it matches the expected interface
        const searchTerm = req.query as IQueryParams;
        const doctors = await DoctorService.getAllDoctors(searchTerm);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctors retrieved successfully",
            data: doctors
        })
    }
);

const getDoctorById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        console.log(id)
        const doctors = await DoctorService.getDoctorById(id as string)
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "retrieved single doctor successfully",
            data: doctors
        })
    }
);

const updateDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new AppError(status.NOT_FOUND, "Doctor id not found");
        }
        const payload = req.body;
        const updatedDoctor = await DoctorService.updateDoctor(id as string, payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor updated successfully",
            data: updatedDoctor
        });
    }
);

const deleteDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const deleteDoctor = await DoctorService.deleteDoctor(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor delete successfully",
            data: deleteDoctor
        })
    }
)


export const DoctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};