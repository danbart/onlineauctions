import { Router } from "express";
import { routerAccount } from "./account.router";
import { routerAuction } from "./auction.router";
import { routerbodyStyle } from "./bodyStyle.router";
import { routerCompany } from "./company.router";
import { routerImagen } from "./image.router";
import { routerLogin } from "./login.router";
import { routerNote } from "./note.router";
import { routerState } from "./state.router";
import { routerType } from "./type.router";
import { routerUser } from "./user.router";
import { routerVehicle } from "./vehicle.router";
import { routerOpinion } from './opinion.router';

const router = Router();

router.use("/", routerLogin);
router.use("/user/", routerUser);
router.use("/user/", routerAccount);
router.use("/state/", routerState);
router.use("/style/", routerbodyStyle);
router.use("/type/", routerType);
router.use("/vehicle/", routerNote);
router.use("/vehicle/", routerVehicle);
router.use("/vehicle/", routerOpinion);
router.use("/company/", routerCompany);
router.use("/imagen/", routerImagen);
router.use("/auction/", routerAuction);

export default router;
