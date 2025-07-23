import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMET_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";

const getTransactionId = (): string => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const user = await User.findById(userId);
  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Update Your Profile to Book a Tour"
    );
  }

  const booking = await Booking.create({
    user: userId,
    status: BOOKING_STATUS.PENDING,
    ...payload,
  });

  const tour = await Tour.findById(payload.tour).select("costFrom");

  if (!tour?.costFrom) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
  }

  const amount = Number(tour.costFrom) * Number(payload.guestCount);

  const transactionId = getTransactionId();

  const payment = await Payment.create({
    booking: booking._id,
    status: PAYMET_STATUS.UNPAID,
    transactionId,
    amount,
  });

  const updatedBooking = await Booking.findByIdAndUpdate(booking._id, {
    payment: payment._id
  }, {new: true, runValidators: true})

  return updatedBooking
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
