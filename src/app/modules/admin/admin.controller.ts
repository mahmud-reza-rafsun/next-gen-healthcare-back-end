import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";

const getAllAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const retriveAdmins = await AdminService.getAllAdmin();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "All Admin Retrive successful",
            data: retriveAdmins
        });
    }
);

const getAdminById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params
        const updateAdmin = await AdminService.getAdminById(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Get Single Admin Successful",
            data: updateAdmin
        })
    }
);

const updateAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const data = req.body;
        const { id } = req.params
        if (!id) {
            throw new AppError(status.NOT_FOUND, "Admin not found!!")
        }
        const adminUpdate = await AdminService.updateAdmin(id as string, data);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Update admin Successful",
            data: adminUpdate
        })
    }
);

const deleteAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.user
        const deleteAdmin = await AdminService.deleteAdmin(id as string, data);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Delete admin Successful",
            data: deleteAdmin
        })
    }
)

export const AdminController = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
}

