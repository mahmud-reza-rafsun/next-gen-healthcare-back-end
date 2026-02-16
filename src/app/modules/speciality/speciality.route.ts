import { Router } from "express";
import { SpecialityController } from "./speciality.controller";

const router = Router();

router.post("/", SpecialityController.createSpeciality);
router.get("/", SpecialityController.getAllSpeciality);
router.delete("/:id", SpecialityController.deleteSpecialty);
router.put('/:id', SpecialityController.updateSpeciality);

export const SpecialityRoute = router;