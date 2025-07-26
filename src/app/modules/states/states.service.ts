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

  const newUsersInLast7DaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
  const newUsersInLast30DaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

  const usersByRolePromse = User.aggregate([
    {
        $group: {
            _id: "$role",
            count: {$sum: 1}
        }
    }
  ])

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
  return;
};

const booking = async () => {
  return;
};

const payment = async () => {
  return;
};

export const StatesServices = {
  user,
  booking,
  payment,
  tour,
};
