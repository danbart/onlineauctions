import { Router } from "express";
import { routerLogin } from "./login.router";
import { routeState } from "./state.route";
import { routeUser } from "./user.route";

const router = Router();

router.use("/", routerLogin);
router.use("/user/", routeUser);
router.use("/state/", routeState);

export default router;
