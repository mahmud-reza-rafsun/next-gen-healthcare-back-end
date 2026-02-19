import { Router } from "express";
import { createDoctorZodSchema } from "./user.validation";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router()

router.post("/create-doctor", validateRequest(createDoctorZodSchema), UserController.createDoctor);

export const UserRoutes = router;