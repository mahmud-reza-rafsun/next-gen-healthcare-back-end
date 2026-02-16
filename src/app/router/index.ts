import { Router } from "express";
import { SpecialityRoute } from "../modules/speciality/speciality.route";

const router = Router();

router.use("/specialties", SpecialityRoute);

export const IndexRoute = router;