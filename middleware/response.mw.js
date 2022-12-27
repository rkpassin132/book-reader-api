export default function (req, res, next) {
  res.sendRes = function (statusCode = 200, message = "", data = null) {
    let responseData = { success: statusCode == 200 ? true : false, message };
    if (!data) return res.status(statusCode).send(responseData);

    let validStatuCode = [200, 201];
    if (validStatuCode.includes(statusCode)) responseData = { ...responseData, ...data};
    else responseData["errors"] = data;
    return res.status(statusCode).send(responseData);
  };
  next();
}
