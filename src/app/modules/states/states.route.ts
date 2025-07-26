import { Router } from "express";
import { StatesController } from "./states.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get("/users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatesController.user);
router.get("/tours", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatesController.tour);
router.get("/bookings", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatesController.booking);
router.get("/payments", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatesController.payment);

export const StatesRoutes = router;