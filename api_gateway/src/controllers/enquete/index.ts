import * as create from "./createEnquete";
import * as del from "./deleteEnquete";
import * as detail from "./detailEnquete";
import * as update from "./updateEnquete";

export const EnqueteController = {
  ...create,
  ...del,
  ...detail,
  ...update,
};
