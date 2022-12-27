import mongoose from 'mongoose';

export const bookSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, 

  premimum: {
    type: Boolean,
    default: false,
  },

  publish: {
    type: Boolean,
    default: false,
  },

  book_price: {
    type: Number,
    default: '0',
  },

  buy_link:{
    type: String,
    default: ""
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bookcategories'
  },

  title: String,

  discription_about: {
    type: String,
    default: ""
  },
  
  discription_for: {
    type: String,
    default: ""
  },

  images: [
    {
      _id:false,
      image_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      image: {
        type: String,
        default: "https://default-img-url.png",
      }
    }
  ],

  pdfFile: [
    {
      _id:false,
      file_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      file: {
        type: String,
        default: "https://default-img-url.png",
      }
    }
  ],

  pdfs:[
    {
      _id:false,
      pdf_page_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      page_no: Number,
      heading: String,
      content: String,
    }
  ],
  
  audios: [
    {
      _id:false,
      audio_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      page_no: Number,
      audio: {
        type: String,
        default: "https://default-img-url.png",
      },
      download_audio: {
        type: String
      }
    }
  ],

  views: [
    {
      _id:false,
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      created:{
        type: Date,
        default: Date.now()
      }
    }
  ],

  likes: [
    {
      _id:false,
      like_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      created:{
        type: Date,
        default: Date.now()
      }
    }
  ],

  hearts: [
    {
      _id:false,
      heart_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      created:{
        type: Date,
        default: Date.now()
      }
    }
  ], 

  comments: [
    {
      _id:false,
      comment_id:{
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comment:{
        type: String,
        null: false
      },
      created:{
        type: Date,
        default: Date.now()
      }
    }
  ],

  created: {
    type: Date,
    default: Date.now(),
  }
  
});

const Book = mongoose.model("Book", bookSchema);
export default Book;