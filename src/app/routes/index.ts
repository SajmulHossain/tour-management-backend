import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";
import { UserRoutes } from "./../modules/user/user.route";
<<<<<<< HEAD
import { TourRoutes } from "../modules/tour/tour.route";
=======
>>>>>>> 0ec6bb4e48c5d83a7a428dee6e8275185f671e33

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
<<<<<<< HEAD
  {
    path: '/tour',
    route: TourRoutes
  }
=======
>>>>>>> 0ec6bb4e48c5d83a7a428dee6e8275185f671e33
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
