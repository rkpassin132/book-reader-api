import BookCategory from "../models/bookCategory.model.js";
import { validateLimit } from "../validations/common.validation.js";

export const getCategories = async (req, res) => {
    if (req.query.limit) {
        const error = validateLimit(req.query);
        if (error) return res.sendRes(400, "Can't able to find book!", error);
    }

    let categories = [];
    if (req.query.limit) {
        categories = await BookCategory.find().limit(req.query.limit).sort({created:1});
    }else{
        categories = await BookCategory.find().sort({created:1});
    }
    return res.sendRes(200, "Book categories list", {categories});
};