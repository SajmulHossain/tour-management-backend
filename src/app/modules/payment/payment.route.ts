import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/init-payment/:id", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.post("/validate-payment", PaymentController.validatePayment)
router.get("/invoice/:id", PaymentController.getInvoiceUrl)

export const PaymentRoutes = router;
