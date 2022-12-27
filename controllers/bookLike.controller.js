import mongoose from "mongoose";
import Book from "../models/book.model.js";
import { getBookUserLikes } from "../services/bookLikes.service.js";
import { validateObjectId } from "../validations/common.validation.js";

export const getBookLikes = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let book_id = req.params.book_id;
    let likes = await Book.aggregate([
        { $unwind: '$likes' },
        { $match: { _id: mongoose.Types.ObjectId(book_id) } },
        { $project: { _id: 0, like_id: "$likes.like_id", user: '$likes.user', created: '$likes.created' } }
    ]);
    if (Array.isArray(likes) === false || likes.length <= 0) {
        return res.sendRes(404, "No likes found");
    }
    return res.sendRes(200, "Likes list", {likes});
};

export const getBookLikeCount = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let book_id = req.params.book_id;
    let likes = await Book.aggregate([
        { $unwind: '$likes' },
        { $match: { _id: mongoose.Types.ObjectId(book_id) } },
        { $project: { _id: 0, likes: "$likes.like_id" } },
    ]);
    console.log(likes);
    return res.sendRes(200, "Likes list", { likes_count: likes.length});
};

export const getIsBookLiked = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let book_id = req.params.book_id;
    let likes = await getBookUserLikes(book_id, req.user._id);
    if (Array.isArray(likes) === false || likes.length <= 0) {
        return res.sendRes(200, "User not liked", { like: false });
    }
    return res.sendRes(200, "User like this book", { like: true });
};

export const setBookLike = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let book_id = req.params.book_id;
    let likes = await getBookUserLikes(book_id, req.user._id);
    if (Array.isArray(likes) !== false && likes.length > 0) {
        return res.sendRes(200, "User already liked book", {liked:false});
    }
    await Book.updateOne(
        { _id: mongoose.Types.ObjectId(book_id) },
        {
            $push: {
                likes: {
                    user: req.user._id,
                }
            }
        }
    );
    return res.sendRes(200, "User like book", {liked:true});
};

export const removeBookLike = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);
    
    let book_id = req.params.book_id;
    let likes = await getBookUserLikes(book_id, req.user._id);
    if (Array.isArray(likes) === false || likes.length <= 0) {
        return res.sendRes(200, "User not liked book",{delete:false});
    }
    await Book.updateOne(
        { _id: mongoose.Types.ObjectId(book_id) },
        {
            $pull: {
                likes: {
                    "user": mongoose.Types.ObjectId(req.user._id),
                }
            }
        }
    );
    return res.sendRes(200, "User like removed", {deleted:true});
};