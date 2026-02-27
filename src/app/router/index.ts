import { Router } from "express";
import { SpecialityRoute } from "../modules/speciality/speciality.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.routes";
import { DoctorRoute } from "../modules/doctor/doctor.route";
import { AdminRoute } from "../modules/admin/admin.route";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/specialties", SpecialityRoute);
router.use("/users", UserRoutes);
router.use("/doctors", DoctorRoute);
router.use("/admins", AdminRoute);

export const IndexRoute = router;