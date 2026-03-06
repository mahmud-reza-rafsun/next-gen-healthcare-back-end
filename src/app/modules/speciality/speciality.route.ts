import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
// import { Role } from "../../../generated/prisma/enums";
// import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { createSpecialityZodSchema } from "./speciality.validation";

const router = Router();

router.post("/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(createSpecialityZodSchema),
    SpecialityController.createSpeciality);
router.get("/", SpecialityController.getAllSpeciality);
router.delete("/:id", SpecialityController.deleteSpecialty);
router.put('/:id', SpecialityController.updateSpeciality);

export const SpecialityRoute = router;