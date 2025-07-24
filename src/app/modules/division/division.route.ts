import { Router } from "express";
import { DivisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validationRequest } from "../../middlewares/validateRequest";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get("/", DivisionControllers.getAllDivisions);

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validationRequest(createDivisionSchema),
  DivisionControllers.createDivision
);

router.get("/:slug", DivisionControllers.getSingleDivision);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validationRequest(updateDivisionSchema),
  DivisionControllers.updateDivision
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionControllers.deleteDivision
);

export const DivisionRoutes = router;
