import { Router } from "express";
import { validate } from "express-validation";
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

routerUser.get("/", [verificaToken, isRegister], user.getUsers);
routerUser.get("/profile", verificaToken, user.getUserId);
routerUser.get("/profile/vehicle", verificaToken, user.getProfileVehicles);
routerUser.get("/profile/auctioned", verificaToken, user.getProfileAuctioneds);
routerUser.get("/profile/role", verificaToken, user.getUserRoleId);
routerUser.get("/:id/role", verificaToken, isAdmin, user.getUserRoleId);
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
