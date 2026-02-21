import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.createSpeciality);
router.get("/", SpecialityController.getAllSpeciality);
router.delete("/:id", SpecialityController.deleteSpecialty);
router.put('/:id', SpecialityController.updateSpeciality);

export const SpecialityRoute = router;