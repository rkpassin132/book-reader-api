import express from "express";
import { logout } from "../controllers/auth.controller.js";
import * as user from "../controllers/user.controller.js";
import * as bookCategory from "../controllers/bookCategory.controller.js";
import * as book from "../controllers/book.controller.js";
import * as bookView from "../controllers/bookView.controller.js";
import * as bookLike from "../controllers/bookLike.controller.js";
import * as bookSearch from "../controllers/bookSearch.controller.js";
import * as userLibrary from "../controllers/userLibrary.controller.js";
import * as bookContent from "../controllers/bookContent.controller.js";

const router = express.Router();

router.get("/auth/logout", logout);


router.get("/book-category", bookCategory.getCategories);

router.get("/books", book.getBooks);
router.get("/books/book_id/:book_id", book.getBookById);
router.get("/books/buyLink/:book_id", book.bookBuyLink);
router.get("/books/recommended", book.getRecommendedBooks);
router.get("/books/trending", book.getTrandingBooks);
router.get("/books/newly", book.getNewlyBooks);

router.get("/library", userLibrary.getAllUserLibrary);
router.get("/library/:book_id", userLibrary.isUserBookLibrary);
router.post("/library/:book_id", userLibrary.setUserLibrary);
router.delete("/library/:book_id", userLibrary.deleteUserLibrary);

router.get("/book-view/:book_id", bookView.getBookViewsCount);
router.get("/book-pdf/:book_id", bookContent.getBookPdf);
router.get("/book-audio/:book_id", bookContent.getBookAudio);

router.get("/book-like/:book_id", bookLike.getBookLikes);
router.get("/book-like/count/:book_id", bookLike.getBookLikeCount);
router.get("/book-like/isliked/:book_id", bookLike.getIsBookLiked);
router.post("/book-like/:book_id", bookLike.setBookLike);
router.delete("/book-like/:book_id", bookLike.removeBookLike);

router.get("/book-search/category/:category_id", bookSearch.getSearchBookByCategory);
router.get("/book-search/title/:search", bookSearch.getSearchBookByTitle);

router.get("/user", user.getUser);
router.patch("/user", user.updateUser);

export default router;
