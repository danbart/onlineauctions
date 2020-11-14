import moment from "moment";
import { FORMAT_DATE } from "../global/environment";

export const dayOfAuction = () => {
  let monday = moment().day(1).diff(moment(), "day");
  let friday = moment().day(5).diff(moment(), "day");

  if (monday <= friday && friday <= 0) {
    return moment().day(8).format(FORMAT_DATE);
  } else if (monday >= friday && monday >= 0) {
    return moment().day(1).format(FORMAT_DATE);
  } else if (friday >= monday && friday >= 0) {
    return moment().day(5).format(FORMAT_DATE);
  }
};
