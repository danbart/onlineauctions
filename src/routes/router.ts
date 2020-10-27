import { Router } from "express";
import { routerbodyStyle } from "./bodyStyle.router";
import { routerLogin } from "./login.router";
import { routerState } from "./state.router";
import { routerUser } from "./user.router";
import { routerType } from './type.router';

const router = Router();

router.use("/", routerLogin);
router.use("/user/", routerUser);
router.use("/state/", routerState);
router.use("/style/", routerbodyStyle);
router.use("/type/", routerType);

export default router;
