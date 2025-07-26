/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
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

    if (!updatedPayment) {
      throw new AppError(404, "Payment info not found");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.COMPLETED },
      { session, runValidators: true, new: true }
    )
      .populate("tour", "title")
      .populate("user", "name email");

    if (!updatedBooking) {
      throw new AppError(404, "Booking info not found");
    }

    const invoiceData: IInvoiceData = {
      bookingDate: updatedBooking?.createdAt as Date,
      guestsCount: updatedBooking?.guestCount,
      amount: updatedPayment.amount,
      tourTitle: (updatedBooking?.tour as unknown as ITour).title,
      transactionId: updatedPayment.transactionId,
      username: (updatedBooking.user as unknown as IUser).name,
    };

    const pdfBuffer = await generatePdf(invoiceData);
    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );

    if (!cloudinaryResult) {
      throw new AppError(400, "Error while uploading pdf to cloudinary");
    }

    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      {
        invoiceUrl: cloudinaryResult.secure_url,
      },
      {
        runValidators: true, session
      }
    );

    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Booking Confirmation Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          fileName: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

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

const getInvoiceUrl = async(id: string) =>  {
  const data = await Payment.findById(id).select("invoiceUrl -_id");

  return data;
}

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceUrl
};
