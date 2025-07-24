import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMET_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { IUser } from "../user/user.interface";
import { getTransactionId } from "../../utils/getTransaction";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please Update Your Profile to Book a Tour"
      );
    }

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount);

    const transactionId = getTransactionId();

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMET_STATUS.UNPAID,
          transactionId,
          amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");
      
    const sslPayment = await SSLService.sslPaymentInit({
      address: (updatedBooking?.user as Partial<IUser>).address as string,
      amount,
      email: (updatedBooking?.user as Partial<IUser>).email as string,
      name: (updatedBooking?.user as Partial<IUser>).name as string,
      phoneNumber: (updatedBooking?.user as Partial<IUser>).phone as string,
      transactionId,
    });

    await session.commitTransaction();
    session.endSession();
    return { booking: updatedBooking, paymentUrl: sslPayment.GatewayPageURL };
  } catch (error) {
    await session.abortTransaction(); // * transaction rollback
    session.endSession();
    throw error;
  }
};

const getUserBookings = () => {
  return {};
};
const getBookingById = () => {
  return {};
};
const getAllBookings = () => {
  return {};
};
const updateBookingStatus = () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
};
