import mongoose from "mongoose";
import Book from "../models/book.model.js";
import { validateLimit, validateObjectId } from "../validations/common.validation.js";

export const getSearchBookByCategory = async (req, res) => {
    const error = validateObjectId({ _id: req.params.category_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }

    let query = [
        {
            $match: {
                "category": mongoose.Types.ObjectId(req.params.category_id)
            }
        },
        {
            $group: {
                _id: "$_id",
                premimum: { "$first": "$premimum" },
                title: { "$first": "$title" },
                images: { "$first": "$images" },
                created: { "$first": "$created" },
                totalviews: {
                    $sum: "$views"
                }
            }
        },
        {
            $sort: {
                created: -1
            }
        }
    ]
    if (req.query.limit) query.push({ $limit: Number.parseInt(req.query.limit) })
    let books = await Book.aggregate(query);
    return res.sendRes(200, "Book list", {books});
};

export const getSearchBookByTitle = async (req, res) => {
    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }

    let query = [
        {
            $match: {
                "title": { $regex: new RegExp(req.params.search, 'i') }
            }
        },
        {
            $group: {
                _id: "$_id",
                category: { "$first": "$category" },
                owner: { "$first": "$owner" },
                title: { "$first": "$title" },
                type: { "$first": "$type" },
                images: { "$first": "$images" },
                discription_about: { "$first": "$discription_about" },
                discription_for: { "$first": "$discription_for" },
                created: { "$first": "$created" },
                totallike: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                created: -1
            }
        }
    ];
    if (req.query.limit) query.push({ $limit: Number.parseInt(req.query.limit) })
    let books = await Book.aggregate(query);
    return res.sendRes(200, "Book list", {books});
};
