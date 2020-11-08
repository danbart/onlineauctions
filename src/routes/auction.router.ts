import { Router } from "express";
import { validate } from "express-validation";
import { Auction } from "../classes/auction";
import { verificaToken } from "../middlewares/autentication";
import {
  auctionValidator,
  auctionValidatorUpdate,
} from "../middlewares/validatorsAuction";

export const routerAuction = Router();
const auction = new Auction();

routerAuction.get("/", auction.getAuction);

routerAuction.get("/:id", auction.getAuctionId);

routerAuction.get("/:id/auctioned", auction.getAuctionIdAuctioned);

routerAuction.post(
  "/vehicle/:id",
  verificaToken,
  validate(auctionValidator),
  auction.postAuction
);

routerAuction.put(
  "/:idAuction/vehicle/:idVehicle",
  verificaToken,
  validate(auctionValidatorUpdate),
  auction.putAuctionIncrementAmount
);
