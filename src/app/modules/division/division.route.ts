import { Router } from "express";
import { DivisionControllers } from "./division.controller";

const router = Router();

router.get("/", DivisionControllers.getAllDivision);
router.post("/create", DivisionControllers.createDivision);

export const DivisionRoutes = router;
