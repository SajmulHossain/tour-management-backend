import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { IUser } from "../user/user.interface";
import { PAYMET_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (id: string) => {
  const payment = await Payment.findOne({ booking: id });

  if (!payment) {
    throw new AppError(404, "Booking not found");
  }

  const booking = await Booking.findById(payment.booking);

      const sslPayment = await SSLService.sslPaymentInit({
        address: (booking?.user as Partial<IUser>).address as string,
        amount: payment.amount,
        email: (booking?.user as Partial<IUser>).email as string,
        name: (booking?.user as Partial<IUser>).name as string,
        phoneNumber: (booking?.user as Partial<IUser>).phone as string,
        transactionId: payment.transactionId,
      });

      return sslPayment.GatewayPageURL;
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMET_STATUS.PAID },
      { session, runValidators: true }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETED },
      { session, runValidators: true }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment Completed" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMET_STATUS.FAILED },
      { session, runValidators: true }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { session, runValidators: true }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMET_STATUS.CANCELD },
      { session, runValidators: true }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCELD },
      { session, runValidators: true }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
