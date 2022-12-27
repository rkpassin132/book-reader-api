import Joi from "joi";

export function validateData(schema, data) {
  schema = Joi.object().keys(schema).unknown(false);
  let { error } = schema.validate(data, { abortEarly: false });
  if (!error) return null;

  let errorMessages = {};
  for (let err of error.details) errorMessages[err.context.label] = err.message;
  return errorMessages;
}

export function validateObjectId(_id) {
  let schema = {
    _id: Joi.objectId().required(),
  };
  return validateData(schema, _id);
}

export function validateLimit(limit) {
  let schema = {
    limit: Joi.number().required(),
  };
  return validateData(schema, limit);
}
