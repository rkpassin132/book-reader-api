import * as _ from 'lodash';
// import bcrypt from "bcrypt";
import User from '../models/user.model.js';
import axios from 'axios';

export const login = async (req, res) => {
  let url;
  if (req.body.category == 'google') {
    url =
      'https://www.googleapis.com/oauth2/v3/userinfo?access_token=' +
      req.body.token;
  } else if (req.body.category == 'facebook') {
    url =
      'https://graph.facebook.com/me?fields=email,name&access_token=' +
      req.body.token;
  } else {
    return res.sendRes(400, 'No proper data');
  }
  let urlData = await axios.get(url);
  if (urlData.status != 200) return res.sendRes(400, 'No proper data');
  let user = await User.findOne({email: urlData.data.email});
  if (!user) {
    user = new User({
      email: urlData.data.email,
      name: urlData.data.name,
      image: urlData.data.picture,
    });
    await user.save();
  }

  const token = user.generateAuthToken();
  return res.sendRes(200, 'User logged in.', {token, user});
};

export const logout = async (req, res) => {
  return res.send('logout');
};

export const loginForMe = async (req, res) => {
  let user = await User.findOne({email: req.body.email});
  if (!user) {
    user = new User({
      email: req.body.email,
      name: req.body.name,
      image: req.body.image,
    });
    await user.save();
  }

  const token = user.generateAuthToken();
  return res.sendRes(200, 'User logged in.', {token, user});
};
