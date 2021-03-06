import { Router } from "express";
import { validate } from "express-validation";
import { Auction } from "../classes/auction";
import { Payment } from "../classes/payment";
import { isRegister, verificaToken } from "../middlewares/autentication";
import {
  auctionedValidator,
  auctionValidator,
  auctionValidatorUpdate,
} from "../middlewares/validatorsAuction";

export const routerAuction = Router();
const auction = new Auction();

const payment = new Payment();

routerAuction.get("/", auction.getAuction);

routerAuction.get("/:id", auction.getAuctionId);

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

routerAuction.get("/:id/auctioned", auction.getAuctionIdAuctioned);

routerAuction.get(
  "/:idAuction/auctioned/:idAuctioned",
  auction.getAuctionIdAuctionedId
);

routerAuction.post(
  "/:id/auctioned",
  verificaToken,
  validate(auctionedValidator),
  auction.postAuctionIdAuctioned
);

routerAuction.post(
  "/:idAuction/buyer/:idUser",
  verificaToken,
  isRegister,
  payment.postPayment
);
