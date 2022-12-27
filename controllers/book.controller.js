import mongoose from "mongoose";
import Book from "../models/book.model.js";
import { bookCategoryByLikes } from "../services/bookCategory.service.js";
import { userLibraries } from "../services/bookLibrary.service.js";
import { validateLimit, validateObjectId } from "../validations/common.validation.js";

export const getBooks = async (req, res) => {
    let books = await Book.find();
    return res.sendRes(200, "Book list", books);
};

export const getBookById = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let book_id = req.params.book_id;
    let book = await Book.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'U'
            }
        },
        { $unwind: "$U" },
        {
            $lookup: {
                from: 'bookcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'C'
            }
        },
        { $unwind: "$C" },
        { $match: { "_id": mongoose.Types.ObjectId(book_id) } },
        {
            $project: {
                _id: 1,
                premimum: "$premimum",
                title: "$title",
                type: "$type",
                buy_link:"$buy_link",
                images: "$images",
                discription_about: "$discription_about",
                discription_for: "$discription_for",
                created: "$created",
                totalviews: {
                    $sum: "$views"
                },
                totallike: {
                    $sum: "$likes"
                },
                category: {
                    _id: "$category",
                    iconCategory: "$C.iconCategory",
                    category: "$C.category"
                },
                owner: {
                    _id: "$owner",
                    name: "$U.name",
                    image: "$U.image"
                },
            }
        }
    ]);
    return res.sendRes(200, "Book details", {book:book[0]});
};
export const bookBuyLink = async (req, res) => {
    let book_id = req.params.book_id;
    let book = await bookModel.findOne({ _id: book_id }, { buy_link: 1 });
    return res.sendRes(200, "Book link", book.buy_link);
};

export const getRecommendedBooks = async (req, res) => {
    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }

    let book = await bookCategoryByLikes(req.user._id);
    if (Object.keys(book).length <= 0) return res.sendRes(200, "Book list", {books:[]});
    let books = await Book.aggregate([
        { $match: { $and: [{ "category": book[0].category }, { publish: true }] } },
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
        },
        { $limit: (req.query.limit) ? Number.parseInt(req.query.limit) : 40 }
    ]);
    return res.sendRes(200, "Book list", {books});
};

export const getTrandingBooks = async (req, res) => {
    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }
    
    let query = [{ $match: { $and: [{ publish: true }] } },
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
            totallike: -1
        }
    }]
    if (req.query.limit) query.push({ $limit: Number.parseInt(req.query.limit) })
    let books = await Book.aggregate(query);
    return res.sendRes(200, "Book list", {books});
};

export const getNewlyBooks = async (req, res) => {
    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }

    let query = [{ $match: { $and: [{ publish: true }] } },
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
    }];
    if (req.query.limit) query.push({ $limit: Number.parseInt(req.query.limit) })
    let books = await Book.aggregate(query);
    return res.sendRes(200, "Book list", {books});
};

export const getFreeBooks = async (req, res) => {
    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }

    let query = [{ $match: { $and: [{ publish: true }, { premimum: false }] } },
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
    }];
    if (req.query.limit) query.push({ $limit: Number.parseInt(req.query.limit) })
    let books = await Book.aggregate(query);
    return res.sendRes(200, "Book list", {books});
};

export const getLibraryBooks = async (req, res) => {
    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }

    let libraryBooks = await userLibraries(req.user._id);
    if (Array.isArray(libraryBooks) === false || libraryBooks.length < 1) {
        return res.sendRes(404, "Not found");
    }
    let bookList = new Array;
    libraryBooks.forEach(book => {
        bookList.push(book['book']);
    });

    let query = [{
        $match: {
            $and: [
                { publish: true },
                { "_id": { "$in": bookList } }
            ]
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
    }];
    if (req.query.limit) query.push({ $limit: Number.parseInt(req.query.limit) })
    let books = await Book.aggregate(query);
    return res.sendRes(200, "Book list", {books});
};