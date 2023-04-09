const yup = require("yup");
const mongoose = require("mongoose");

//Define database schema using yup
const bookSchema = yup.object().shape({
  title: yup.string().required(),
  price: yup.number().required(),
  description: yup.string().max(500),
  cover: yup.string().required(),
  author: yup.string().required(),
  genre: yup.string().required()
})

const mongooseSchema = new mongoose.Schema(bookSchema.fields);
module.exports= mongoose.model("booksList", mongooseSchema);
 
