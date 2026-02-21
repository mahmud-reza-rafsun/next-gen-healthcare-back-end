import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
router.get("/:id", DoctorController.getDoctorById);
router.patch("/update-doctor/:id", validateRequest(updateDoctorZodSchema), DoctorController.updateDoctor)
router.delete("/delete-doctor/:id", DoctorController.deleteDoctor);

export const DoctorRoute = router;