import * as create from "./createEnquete";
import * as del from "./deleteEnquete";
import * as detail from "./detailEnquete";
import * as update from "./updateEnquete";
import * as list from "./listEnquetes";

export const EnqueteController = {
  ...create,
  ...del,
  ...detail,
  ...update,
  ...list,
};
