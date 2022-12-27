import mongoose from "mongoose";
import Book from "../models/book.model.js";
import { validateObjectId } from "../validations/common.validation.js";

export const getBookViewsCount = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);
    
    let userView = await getUserBookView(req.params.book_id, req.user._id);
    if (userView.length <= 0) {
       await saveUserBookView(req.params.book_id, req.user._id);
    }
    let views = await getBookViews(req.params.book_id);
    return res.sendRes(200, "Views count", { views_count: views.length});
};

async function getUserBookView(book_id, user_id) {
    return await Book.aggregate([
        { $unwind: '$views' },
        { $match: { $and: [{ _id: mongoose.Types.ObjectId(book_id) }, { "views.user": mongoose.Types.ObjectId(user_id) }] } },
        { $project: { _id: 0, user: '$views.user' } }
    ]);
}

async function saveUserBookView(book_id, user_id) {
    return await Book.updateOne(
        { _id: mongoose.Types.ObjectId(book_id) },
        {
            $push: {
                views: {
                    user: user_id,
                }
            }
        }
    );
}

async function getBookViews(book_id){
    return await Book.aggregate([
        { $unwind: '$views' },
        { $match: { _id: mongoose.Types.ObjectId(book_id) } },
        { $project: { _id: 0, views: "$views.user" } },
    ]);
}