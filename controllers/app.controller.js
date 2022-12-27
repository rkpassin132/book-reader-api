import * as _ from "lodash";
import AppVersion from "../models/appVersion.model.js";

export const ping = async (req, res) => {
    return res.sendRes(200, "App version", true);
};

export const update = async (req, res) => {
    let data = await AppVersion.aggregate([
        { $match: { $and : [
            { app_version: { $gt: req.body.version } },
            { mandatory: true }
        ]} },
        { $project : { 
                _id:0, 
                app_version:"$app_version", 
                message:"$message", 
                mandatory:"$mandatory", 
            } 
        },
        {
            $sort: { app_version: -1 }
        },
    ]);
    let update  = (data.length > 0) ? data[0] : false;
    return res.sendRes(200, "App version", {update});
};