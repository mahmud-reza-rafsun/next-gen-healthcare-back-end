import { Router } from "express";
import { SpecialityRoute } from "../modules/speciality/speciality.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.routes";
import { DoctorRoute } from "../modules/doctor/doctor.route";
import { AdminRoute } from "../modules/admin/admin.route";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../modules/appointment/appointment.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/specialties", SpecialityRoute);
router.use("/users", UserRoutes);
router.use("/doctors", DoctorRoute);
router.use("/admins", AdminRoute);
router.use("/schedule", scheduleRoutes);
router.use("/doctor-schedule", DoctorScheduleRoutes);
router.use("/appointments", AppointmentRoutes);

export const IndexRoute = router;