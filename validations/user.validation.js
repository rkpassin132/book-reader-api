import Joi from "joi";
import { validateData } from "./common.validation.js";

export function validateUser(data) {
  let schema = {
    name: Joi.string().required().min(5).max(50),
    phone: Joi.number().required().min(10)
  };
  return validateData(schema, data);
}
