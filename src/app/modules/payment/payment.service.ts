import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMET_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMET_STATUS.PAID },
      { session, runValidators: true, new: true }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { session, runValidators: true, new: true }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

      await session.commitTransaction();
      session.endSession();

      return {success: true, message: 'Payment Completed'}
  } catch (error) {
    await session.abortTransaction()
    session.endSession();
    console.log(error);
  }
};

const failPayment = () => {};
const cancelPayment = () => {};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};
