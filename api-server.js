const express = require("express");
const mongoose = require("mongoose");
const app = express();
const booksList = require("./models")
const PORT = process.env.PORT || 8080

//Middleware added for routes
app.use(express.static("/Users/LENOVO/desktop/Project folder/nodejs"))
app.use(express.json())

//Home route
app.get("/", (req, res)=>{
    res.sendFile("/Users/LENOVO/desktop/Project folder/nodejs/index.html")
});

// HTTP GET REQUEST for API/books route
app.get("/api/books", async(req, res)=>{
    try {
    const allBooks = await booksList.find();
    res.status(200).json(allBooks);
    } catch (error) {
        res.status(400).send("Oops! there was an error. Check that the URL is correct")
    }
});

// HTTP GET REQUEST for API/books route by ID
app.get("/api/books/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const book = await booksList.findById(id);
        res.status(200).json(book)
    } catch (error) {
        res.sendStatus(400)
    }
});

// HTTP PUT REQUEST for API/books route
app.put("/api/books/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const book = await booksList.findByIdAndUpdate(id, req.body);
        const updatedBook = await booksList.findById(id);
        res.status(200).json(updatedBook)
    } catch (error) {
        res.status(400).send("There was an error deleting the book")
    }
});

// HTTP DELETE REQUEST for API/books route
app.delete("/api/books/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const book = await booksList.findByIdAndDelete(id)
        res.status(200).json(book)
    } catch (error) {
        res.status(400).send("There was an error deleting the book")
    }
})


// HTTP POST REQUEST for API/books route 
app.post("/api/books", async (req, res)=>{
    try {
        const book = await new booksList({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image
        })
        const savedbook = await book.save();
        res.status(201).json(savedbook)
    } catch (error) {
        console.log({message: error})
    }
})

app.get("/*", (req, res)=>{
    res.sendFile("/Users/LENOVO/desktop/Project folder/nodejs/404.html");
});

mongoose.connect("mongodb+srv://vintage:aWIwp6O1Nk0q9COq@cluster0.osz58d2.mongodb.net/booksAPI?retryWrites=true&w=majority")
.then(()=>{
    console.log("connected to DB");
    app.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}`)
    })
}).catch(error=>{
    console.log(error)
})
