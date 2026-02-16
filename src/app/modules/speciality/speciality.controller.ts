import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";

const createSpeciality = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const speciality = await SpecialityService.createSpeciality(payload);
        res.status(201).json({
            suiccess: true,
            message: "Speciality created successfully",
            data: speciality
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create speciality",
            error: error
        });
    }
}

const getAllSpeciality = async (req: Request, res: Response) => {
    try {
        const specialities = await SpecialityService.getAllSpeciality();
        res.status(200).json({
            success: true,
            message: "Specialities retrieved successfully",
            data: specialities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve specialities",
            error: error
        });
    }
}

const deleteSpecialty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const speciality = await SpecialityService.deleteSpecialty(id as string);
        res.status(200).json({
            success: true,
            message: "Delete Speciality successfully",
            data: speciality
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete speciality",
            error: error
        });
    }
}

const updateSpeciality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // console.log({id, data})
        const speciality = await SpecialityService.updateSpeciality(id as string, data);
        res.status(200).json({
            success: true,
            message: "Speciality updated successfully",
            data: speciality
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update speciality",
            error: error
        });
    }
}

export const SpecialityController = {
    createSpeciality,
    getAllSpeciality,
    deleteSpecialty,
    updateSpeciality
}