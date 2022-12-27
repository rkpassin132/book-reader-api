import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

export const userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 5, max: 50, trim: true },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255,
    lowercase: true,
    trim: true,
    unique: true,
  },

  about: {
    type: String,
  },

  image: {
    type: String,
    default: ''
  },

  androidToken:{
    type: String,
    default: ''
  },

  phone:{
    type: String,
  },

  premimum: {
    type: Boolean,
    default: false,
  },

  premimum_expiry: {
    type: Date,
  },

  address: {
    addr: String,
    city: String,
    state: String,
    country: String,
    zip: Number,
  },

  purchase_books:[
    {
      _id:false,
      purchase_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      purchase_book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
      },
      payment_id:{
        type: String,
      },
      created:{
        type: Date,
        default: Date.now()
      }
    }
  ],

  library:[
    {
      _id:false,
      library_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      library_book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
      },
      created:{
        type: Date,
        default: Date.now()
      }
    }
  ],

  follows:[
    {
      _id:false,
      follow_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      follow_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      },
      created:{
        type: Date,
        default: Date.now()
      }
    }
  ],

  created: {
    type: Date,
    default: Date.now(),
  }
});

userSchema.methods.generateAuthToken = function () {
  return Jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
};
const User = mongoose.model("User", userSchema);
export default User;
