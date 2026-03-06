import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


const createSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const payload = {
            ...req.body,
            icon: req.file?.path
        };
        console.log(req.file)
        console.log(payload)
        const speciality = await SpecialityService.createSpeciality(payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Speciality created successfully",
            data: speciality
        });
    }
)

const getAllSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const specialities = await SpecialityService.getAllSpeciality();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Specialities retrieved successfully",
            data: specialities
        })
    }
)

const deleteSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const speciality = await SpecialityService.deleteSpecialty(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Delete Speciality successfully",
            data: speciality
        })
    }
)

const updateSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const speciality = await SpecialityService.updateSpeciality(id as string, data);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Speciality updated successfully",
            data: speciality
        })
    }
)

export const SpecialityController = {
    createSpeciality,
    getAllSpeciality,
    deleteSpecialty,
    updateSpeciality
}