import _ from "lodash";
import User from "../models/user.model.js";
import { validateUser } from "../validations/user.validation.js";
import { validateObjectId } from "../validations/common.validation.js";


export const getUser = async (req, res) => {
  let user = await User.findOne({_id:req.user._id}, { _id:1, name:1, image:1, email:1, phone:1, premimum:1, created:1 });
  if (!user) return res.sendRes(400, "User not exist.");

  return res.sendRes(200, "", {user});
};

export const updateUser = async (req, res) => {
  const error = validateUser(req);
  if (error) return res.sendRes(400, "Can't able to update user!", error);

  let user = await User.findByIdAndUpdate(
    req.user._id,
    _.pick(req.body, ["name", "phone"])
  );
  if (!user) return res.status(400).send("Can't able to update user");
  return res.sendRes(200, "User updated", {user});
};
