import { Router } from "express";
import { validate } from "express-validation";
import { Payment } from "../classes/payment";
import { User } from "../classes/user";
import {
  isAdmin,
  isRegister,
  verificaToken,
} from "../middlewares/autentication";
import {
  userRolValidator,
  userUpdatePasswordValidator,
  userValidator,
  userValidatorUpdate,
} from "../middlewares/validatorsUser";

export const routerUser = Router();
const user = new User();
const payment = new Payment();

routerUser.get("/", [verificaToken, isRegister], user.getUsers);
routerUser.get("/profile", verificaToken, user.getUserId);
routerUser.get("/profile/vehicle", verificaToken, user.getProfileVehicles);
routerUser.get("/profile/auctioned", verificaToken, user.getProfileAuctioneds);
routerUser.get("/profile/role", verificaToken, user.getUserRoleId);
routerUser.get("/profile/sellers", verificaToken, payment.getSellerUserID);
routerUser.get("/profile/buyers", verificaToken, payment.getBuyerUserId);
routerUser.get("/profile/opineds", verificaToken, user.getUserRatingId);
routerUser.get("/profile/commented", verificaToken, user.getUserCommentedId);
routerUser.get("/public/:id", user.getUserIdPublic);
routerUser.get("/:id/role", verificaToken, isAdmin, user.getUserRoleId);
routerUser.get("/:id/opineds", verificaToken, isRegister, user.getUserRatingId);
routerUser.get(
  "/:id/commented",
  verificaToken,
  isRegister,
  user.getUserCommentedId
);
routerUser.get(
  "/:id/sellers",
  verificaToken,
  isRegister,
  payment.getSellerUserID
);
routerUser.get(
  "/:id/buyers",
  verificaToken,
  isRegister,
  payment.getBuyerUserId
);
routerUser.get("/:id", [verificaToken, isRegister], user.getUserId);
routerUser.post(
  "/",
  [verificaToken, isRegister, validate(userValidator)],
  user.postUser
);
routerUser.put(
  "/profile",
  [verificaToken, validate(userValidatorUpdate)],
  user.putUser
);
routerUser.put(
  "/profile/password",
  [verificaToken, validate(userUpdatePasswordValidator)],
  user.updatePasswordUser
);
routerUser.put(
  "/:id",
  [verificaToken, isAdmin, validate(userValidatorUpdate)],
  user.putUser
);
routerUser.post(
  "/:id/createrole",
  [verificaToken, isAdmin, validate(userRolValidator)],
  user.postUserRoleCreate
);
routerUser.delete(
  "/:id/deleterole",
  [verificaToken, isAdmin, validate(userRolValidator)],
  user.deleteUserRole
);
routerUser.post("/profile/avatar", verificaToken, user.postAvatar);

routerUser.post("/:id/avatar", [verificaToken, isRegister], user.postAvatar);
