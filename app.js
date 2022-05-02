//jshint esversion:6
require('dotenv').config();
const nodemailer=require('nodemailer');
const mongoose=require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const _ =require("lodash");
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const homeStartingContent = "Welcome to your Daily journal. All your Existing Journals/Blogs will show up on this page. To compose a new blog, go to Compose section.";


const uri = process.env.DB_URL;
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true});
console.log(process.env.DB_URL);

const Blogschema =  new mongoose.Schema({
  title: String,
 content:String
});

const Bloggy = mongoose.model("Blog",Blogschema );


app.get("/",function(req,res){
  Bloggy.find({},function(err,found){
    if(err){
      console.log(err);
      res.render("home",{content:homeStartingContent,
        post:""
        });
    }else{
      res.render("home",{
        content:homeStartingContent,
        post:found
        });
    }
  })
});


app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const title=req.body.Title;
  const body=req.body.Body;
 const newblog= new Bloggy({
   title:title,
   content:body
 })
 newblog.save();
 res.redirect("/");
});
app.get("/post/:postId", function(req, res){
  const requestedPostId = req.params.postId;
    Bloggy.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        posts:post,
        title: post.title,
        content: post.content
      });
    });
  
  });

app.get("/delete/(:id)", function(req, res, next) {
  Bloggy.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
          res.redirect('/');
      } else {
          console.log('Failed to Delete user Details: ' + err);
      }
  });
})
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
