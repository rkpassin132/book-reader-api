import mongoose from "mongoose";
import User from "../models/user.model.js";

export async function userLibraries(user_id) {
    return await User.aggregate([
        { $unwind: '$library' },
        { $match: { _id: mongoose.Types.ObjectId(user_id) } },
        { $project: { _id: 0, id: "$library.library_id", book: '$library.library_book', created: '$library.created' } }
    ]);
}