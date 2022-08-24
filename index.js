const express= require("express");
const app= express();
const path = require('path');
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
const dotenv= require('dotenv');
dotenv.config({path:'.env'});
const ShortUrl= require("./model/url")



app.use(express.urlencoded({extended:true}));

const mongoose= require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
useUnifiedTopology:true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DataBase Connected");
});


app.get("/",async(req,res)=>{
    const shortUrls=await ShortUrl.find();
    res.render("index.ejs", {shortUrls: shortUrls});
})

app.post("/shortUrl",async(req,res)=>{
    await ShortUrl.create({full: req.body.fullurl});
    res.redirect("/");
})

app.get("/:shortUrl",async(req,res)=>{
    const shortUrl= await ShortUrl.findOne({short: req.params.shortUrl});
    if(shortUrl==null) return res.sendStatus(404);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
})
app.listen(3000,(req,res)=>{
    console.log("listening on Port 3000");
})