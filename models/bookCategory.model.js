import mongoose from 'mongoose';

export const bookCategorySchema = new mongoose.Schema({
  category:{
    type: String,
  },
  iconCategory:{
    type: String,
    default: "no icon"
  },
  created:{
    type: Date,
    default: Date.now()
  }
  
});
const BookCategory = mongoose.model("BookCategory", bookCategorySchema);
export default BookCategory;
