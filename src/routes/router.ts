import { Router } from "express";
import { routerLogin } from "./login.router";
import { routeUser } from "./user.route";

const router = Router();

router.use("/", routerLogin);
router.use("/user/", routeUser);

export default router;
