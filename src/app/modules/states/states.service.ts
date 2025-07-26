import { Booking } from "../booking/booking.model";
import { PAYMET_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const user = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });

  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });

  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const totalDeletedUsersPromise = User.countDocuments({ isDeleted: true });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromse = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    totalDeletedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    totalDeletedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromse,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    totalDeletedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  };
};

const tour = async () => {
  const totalToursPromise = Tour.countDocuments();
  const totalToursByTourTypePromise = Tour.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    // * unwind
    {
      $unwind: "$type",
    },
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    {
      $unwind: "$division",
    },
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const highestTourBookedTourPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const [
    totalTours,
    totalToursByTourTypes,
    avgTourCost,
    totalTourByDivision,
    highestTourBookedTour,
  ] = await Promise.all([
    totalToursPromise,
    totalToursByTourTypePromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    highestTourBookedTourPromise,
  ]);

  return {
    totalTours,
    totalToursByTourTypes,
    avgTourCost,
    totalTourByDivision,
    highestTourBookedTour,
  };
};

const booking = async () => {
  const totalBookingsPromise = Booking.countDocuments();

  const totalBookingByStatusPromise = Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingPerTourPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $project: {
        count: 1,
        "tour.title": 1,
        _id: 1,
        "tour.slug": 1,
      },
    },
  ]);

  const avgGuestPerBookingPromise = Booking.aggregate([
    {
      $group: {
        _id: null,
        avgGuest: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingsLast7daysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const bookingsLast30daysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const bookingByUniqueUserPromise = Booking.distinct("user").then(
    (user) => user.length
  );

  const [
    totalBookings,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestPerBooking,
    bookingsLast7days,
    bookingsLast30days,
    bookingByUniqueUser,
  ] = await Promise.all([
    totalBookingsPromise,
    totalBookingByStatusPromise,
    bookingPerTourPromise,
    avgGuestPerBookingPromise,
    bookingsLast7daysPromise,
    bookingsLast30daysPromise,
    bookingByUniqueUserPromise,
  ]);

  return {
    totalBookings,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestPerBooking: avgGuestPerBooking[0].avgGuest,
    bookingsLast7days,
    bookingsLast30days,
    bookingByUniqueUser,
  };
};

const payment = async () => {
  const totalPaymentsPromise = Payment.countDocuments();

  const totalPaymentsByStatusPromise = Payment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    {
      $match: { status: PAYMET_STATUS.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayments,
    totalPaymentsByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
    totalPaymentsPromise,
    totalPaymentsByStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGatewayDataPromise,
  ]);

  return {
    totalPayments,
    totalPaymentsByStatus,
    totalRevenue: totalRevenue[0].totalRevenue,
    avgPaymentAmount: avgPaymentAmount[0].avgPaymentAmount,
    paymentGatewayData,
  };
};

export const StatesServices = {
  user,
  booking,
  payment,
  tour,
};
