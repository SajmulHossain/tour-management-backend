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
import { Tour } from "./tour.model";

const router = Router();

router.post("/many", async(req, res) => {
  await Tour.create(req.body)
  
  res.send({message: "done"})
})

router.get("/tour-types", TourControllers.getAllTourTypes);

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypeZodSchema),
  TourControllers.createTourType
);

router.patch(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypeZodSchema),
  TourControllers.updateTourType
);

router.delete(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTourType
);

// * <-------- Tours Route ------->
router.get("/", TourControllers.getAllTour);

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

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(updateTourZodSchema),
  TourControllers.deleteTour
);

export const TourRoutes = router;
