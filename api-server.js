const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const booksList = require("./models");
const Quota = require("./quotaSchema");
const User = require("./userSchema");
const cors = require("cors");
const nodemailer = require("nodemailer");
const flutterwave = require('flutterwave-node');
const flw = new flutterwave(
  'FLWPUBK_TEST-5c8af02ad0fa6bdd71253e41809cdf22-X',
  'FLWSECK_TEST-4e221b1a615dc9079c1374124d7b9c9a-X',
);

const PORT = process.env.PORT || 8080



//Middleware added for routes
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

//Home route
app.get("/(|index.html)", (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"))
});
app.get("/(|vintageapi/)pricing(|.html)", (req, res)=>{
    res.sendFile(path.join(__dirname, "pricing.html"))
});
app.get("/(|vintageapi/)subscribe(|.html)", (req, res)=>{
    res.sendFile(path.join(__dirname, "vintageapi","subscribe.html"))
});
app.get("/(|vintageapi/)signup(|.html)", (req, res)=>{
    res.sendFile(path.join(__dirname, "vintageapi","signup.html"))
});


//Sign up route
app.post("/signup(|.html)", async (req, res) => {
    try {
      // Create a new user
      const userRecord = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const savedUser = await userRecord.save();
      
      // Save the custom token as the user ID and set the quota to the default value
      const Id = savedUser._id;
      const quota = new Quota({
      userId: Id,
      requestsRemaining: 2,
    });
    await quota.save();
  
      // Send the ID token to the user via email
      const transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
          user: "vintageapi@outlook.com",
          pass: "Cc7817##**",
        },
      });
  
      const mailOptions = {
        from: "vintageapi@outlook.com",
        to: req.body.email,
        subject: "Your API key",
        text: `Your API key is: Bearer ${Id}`,
      };
  
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json({ message: "User created successfully." });
          console.log("Email sent: " + info.response);
        }
      });
  
    } catch (error) {
      console.log(error);
      if(error.keyPattern.email === 1){
        return res.status(500).send("Email or password already exist");
      }
    }
  });
  

// HTTP GET REQUEST for API/books route
app.get('/api/books', async (req, res) => {
    try {
    // Extract the user ID from Firebase Authentication token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized');
    }
    
    const idToken = authHeader.split('Bearer ')[1];

    // Find or create the user's quota
    const quota = await Quota.findOneAndUpdate(
      { userId: idToken },
      { $inc: { requestsRemaining: -1 } },
      { new: true, upsert: true }
    );
  
      // Check user's quota
      if (!quota) {
        return res.status(401).send({ error: 'User ID not found in database.' });
      }
      // Check if the user has exceeded their quota
      if (quota.requestsRemaining <= 0 ||  new Date() > quota.expiryDate) {
        return res.status(403).send({ message: 'API call limit exceeded. Please subscribe to make more API calls.' });
      }

      const user = await User.findById(idToken);
      if(user){
        const books = await booksList.find();
        return res.status(200).json(books);
      }
    } catch (error) {
      const name = await User.findById(idToken);
      console.log(error);
      res.status(500).send(`I'm sorry ${name.name}, an error occurred while processing your request.`);
    }
  });

  //Subscription route
  app.post("/subscribe(|.html)", async(req, res)=>{
  
    //Flutterwave webhook implemented
    const payload = req.body;
    const signature = req.headers['verif-hash'];
    const isValid = flw.webhook.verify(signature, payload);
    if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
 
  const { status, tx_ref } = payload;

  if (status === 'successful') {
    try {
      const user = await User.findOneAndUpdate(
        { txRef: tx_ref },
        { $set: { isSubscribed: true } },
        { new: true }
      );

      // Set the quota's expiry date to 30 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      await Quota.findOneAndUpdate(
        { userId: user._id },
        { $set: { requestsRemaining: Number.MAX_SAFE_INTEGER, expiryDate: expiryDate } },
        { new: true, upsert: true }
      );

      return res.status(200).send('Subscription successful');
    } catch (error) {
      console.log(error);
      return res.status(500).send('An error occurred while processing your request.');
    }
  }
})

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
    res.sendFile(path.join(__dirname, "404.html"));
});

mongoose.connect("mongodb+srv://vintage:aWIwp6O1Nk0q9COq@cluster0.osz58d2.mongodb.net/booksAPI?retryWrites=true&w=majority")
.then(()=>{
    console.log("connected to Database");
    app.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}`)
    })
}).catch(error=>{
    console.log(error)
})
