import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminValidation } from "./admin.validation";

const route = Router();

route.get("/get-all-admin", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), AdminController.getAllAdmin);
route.get("/get-admin/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), AdminController.getAdminById);
route.patch("/update-admin/:id", validateRequest(AdminValidation.updateAdminValidationSchema), checkAuth(Role.SUPER_ADMIN, Role.ADMIN), AdminController.updateAdmin);
route.delete("/delete-admin/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);

export const AdminRoute = route;