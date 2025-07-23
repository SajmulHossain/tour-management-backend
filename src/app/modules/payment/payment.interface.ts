import { Types } from "mongoose";

export enum PAYMET_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCEL = "CANCEL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGatwayData?: any;
  invoiceUrl?: string;
  status: PAYMET_STATUS;
}
