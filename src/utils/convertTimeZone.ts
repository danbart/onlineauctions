import moment from "moment-timezone";

export const convertTimeZone = (date: any) => {
  const Lisbon = moment.tz(date, "Europe/Lisbon");
  const Guate = Lisbon.clone().tz("America/Guatemala");
  return Guate.format();
};
