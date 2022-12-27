import mongoose from "mongoose";
import User from "../models/user.model.js";
import { validateObjectId } from "../validations/common.validation.js";

export const getAllUserLibrary = async (req, res) => {
    let libraries = await User.aggregate([
        { $unwind: '$library' },
        {
            $lookup: {
                from: 'books',
                localField: 'library.library_book',
                foreignField: '_id',
                as: 'B'
            }
        },
        { $match: { _id: mongoose.Types.ObjectId(req.user._id) } },
        {
            $project: {
                _id: 0,
                library: "$library",
                book: {
                    _id: { "$first": "$B._id" },
                    premimum: { "$first": "$B.premimum" },
                    title: { "$first": "$B.title" },
                    images: { "$first": "$B.images" },
                    discription_about: { "$first": "$B.discription_about" },
                    created: { "$first": "$B.created" },
                }
            }
        }
    ]);
    console.log(libraries.length);
    return res.sendRes(200, "library list", { libraries });
}
export const isUserBookLibrary = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let added = await isUserAddBookToLibrary(req.user._id, req.params.book_id);
    if (added.length <= 0) return res.sendRes(200, "Book not added to library", { added: false });
    return res.sendRes(200, "Book already added to library", { added: true, book: added[0] });
}

export const setUserLibrary = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let added = await isUserAddBookToLibrary(req.user._id, req.params.book_id);
    if (added.length > 0) return res.sendRes(200, "Book already added to library", { added: false });

    await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.user._id) },
        {
            $push: {
                library: {
                    library_book: req.params.book_id,
                }
            }
        }
    );
    return res.sendRes(200, "Library added", { added: true });
}
export const deleteUserLibrary = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let added = await isUserAddBookToLibrary(req.user._id, req.params.book_id);
    if (added.length <= 0) return res.sendRes(200, "Book not added to library", { deleted: false });

    await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.user._id) },
        {
            $pull: {
                library: {
                    library_book: mongoose.Types.ObjectId(req.params.book_id),
                }
            }
        }
    );
    return res.sendRes(200, "Book deleted from library", { deleted: true });
}

async function isUserAddBookToLibrary(user_id, book_id) {
    return await User.aggregate([
        { $unwind: '$library' },
        { $match: { $and: [{ _id: mongoose.Types.ObjectId(user_id) }, { "library.library_book": mongoose.Types.ObjectId(book_id) }] } },
        {
            $project: {
                _id: 0,
                library: "$library",
                book: {
                    _id: { "$first": "$B._id" },
                    premimum: { "$first": "$B.premimum" },
                    title: { "$first": "$B.title" },
                    images: { "$first": "$B.images" },
                    discription_about: { "$first": "$B.discription_about" },
                    created: { "$first": "$B.created" },
                }
            }
        }
    ]);
}