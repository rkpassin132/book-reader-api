import mongoose from "mongoose";
import Book from "../models/book.model.js";
import { validateObjectId } from "../validations/common.validation.js";

export const getBookPdf = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let book_id = req.params.book_id;
    let book = await Book.findOne({ _id: mongoose.Types.ObjectId(book_id) }, { _id:1, title:1, pdfs: 1, });
    return res.sendRes(200, "Book Pdf", {book});
}

export const getBookAudio = async (req, res) => {
    const error = validateObjectId({ _id: req.params.book_id });
    if (error) return res.sendRes(400, "Can't able to find book!", error);

    let book_id = req.params.book_id;
    let book = await Book.findOne({ _id: mongoose.Types.ObjectId(book_id) }, { _id:1, title:1, audios: 1, });
    return res.sendRes(200, "Book audios", {book});
}