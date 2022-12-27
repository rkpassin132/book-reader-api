import mongoose from 'mongoose';

export const appVersionSchema = new mongoose.Schema({
  
  app_version:{
    type: Number
  },

  message:{
    type: String
  },

  mandatory: {
    type: Boolean
  },

  created:{
    type: Date,
    default: Date.now()
  }
  
});

const AppVersion = mongoose.model("AppVersion", appVersionSchema);
export default AppVersion;
