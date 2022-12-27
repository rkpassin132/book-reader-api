import mongoose from "mongoose";
import Book from "../models/book.model.js";

export async function getBookUserLikes(book_id, user_id){
    return await Book.aggregate([
        { $unwind: '$likes' },
        { $match: { $and: [{ _id: mongoose.Types.ObjectId(book_id) }, { "likes.user": mongoose.Types.ObjectId(user_id) }] } },
        { $project: { _id: 0, like_id: "$likes.like_id", user: '$likes.user', created: '$likes.created' } }
    ]);
}