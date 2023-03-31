const yup = require("yup");
const mongoose = require("mongoose");

//Define database schema using yup
const bookSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().required(),
  description: yup.string().max(500),
  image: yup.string().required()
})

const mongooseSchema = new mongoose.Schema(bookSchema.fields);
module.exports= mongoose.model("booksList", mongooseSchema);
 
