import { Router } from "express";
import { TourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validationRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema } from "./tour.validation";

const router = Router();

router.get("/tour-types", TourControllers.getAllTourTypes);

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypeZodSchema),
  TourControllers.createTourType
);

router.patch(
  "/:tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypeZodSchema),
  TourControllers.updateTourType
);

export const TourRoutes = router;
