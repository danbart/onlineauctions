import { Router } from "express";
import { routerbodyStyle } from "./bodyStyle.router";
import { routerLogin } from "./login.router";
import { routeState } from "./state.router";
import { routeUser } from "./user.router";

const router = Router();

router.use("/", routerLogin);
router.use("/user/", routeUser);
router.use("/state/", routeState);
router.use("/style/", routerbodyStyle);

export default router;
