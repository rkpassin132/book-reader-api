import Joi from "joi";
import joiObjectId from "joi-objectid";

(function () {
  Joi.objectId = joiObjectId(Joi);
})();
