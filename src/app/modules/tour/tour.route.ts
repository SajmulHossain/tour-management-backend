import { Router } from "express";
import { TourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validationRequest } from "../../middlewares/validateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.validation";

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

// * <-------- Tours Route ------->
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validationRequest(createTourZodSchema),
  TourControllers.createTour
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(updateTourZodSchema),
  TourControllers.updateTour
);

export const TourRoutes = router;
