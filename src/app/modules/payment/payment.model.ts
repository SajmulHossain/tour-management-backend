import { model, Schema } from "mongoose";
import { IPayment, PAYMET_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(PAYMET_STATUS),
    default: PAYMET_STATUS.UNPAID,
  },
  paymentGatwayData: {
    type: Schema.Types.Mixed,
  },
});

export const Payment = model<IPayment>("Payment", paymentSchema);
