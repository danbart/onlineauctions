import { Router } from "express";
import { routerbodyStyle } from "./bodyStyle.router";
import { routerCompany } from "./company.router";
import { routerLogin } from "./login.router";
import { routerNote } from "./note.router";
import { routerState } from "./state.router";
import { routerType } from "./type.router";
import { routerUser } from "./user.router";
import { routerVehicle } from "./vehicle.router";

const router = Router();

router.use("/", routerLogin);
router.use("/user/", routerUser);
router.use("/state/", routerState);
router.use("/style/", routerbodyStyle);
router.use("/type/", routerType);
router.use("/vehicle/", routerNote);
router.use("/vehicle/", routerVehicle);
router.use("/company/", routerCompany);

export default router;
