import mongoose from "mongoose";
import Book from "../models/book.model.js";


export async function bookCategoryByLikes(user_id) {
    return await Book.aggregate([
        {
            $unwind: "$likes"
        },
        { $match: { $and: [{ "likes.user": mongoose.Types.ObjectId(user_id) }, { publish: true }] } },
        {
            $group: {
                _id: "$_id",
                premimum: { "$first": "$premimum" },
                category: { "$first": "$category" },
                owner: { "$first": "$owner" },
                title: { "$first": "$title" },
                images: { "$first": "$images" },
            }
        },
        {
            $sort: {
                totallike: -1
            }
        }
    ]);
}