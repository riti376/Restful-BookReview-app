var express = require("express"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
     app = express();


mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// mongo
var blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    rating: Number,
    image: String,
    body: String,
});

var blog = mongoose.model("blog" , blogSchema);

//Routes

//index
app.get("/" , function(req , res){
    res.redirect("/blogs");
})
app.get("/blogs" , function(req , res){
   blog.find({} , function(err , blogs){
       if(err){
           console.log(err);
       }else{
           res.render("index" , {blogs: blogs});
       }
   })
})
//New
app.get("/blogs/new" , function(req , res){
    res.render("new");
})

//Create
app.post("/blogs" , function(req , res){
    //create blog
   blog.create(req.body.blog , function(err , NewBlog){
       if(err){
           res.render("new");
           //redirect to the index
       }else{
        res.redirect("/blogs");

       }
   })
});

//Show

app.get("/blogs/:id" , function(req , res){
      blog.findById(req.params.id , function(err , foundBlog){
          if(err){
              res.redirect("/blogs");
          }else{
              res.render("show" , {blog: foundBlog});
          }
      })
});

// EDIT

app.get("/blogs/:id/edit" , function(req , res){
    blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit" , {blog: foundBlog});
        }
    });
});

//UPDATE

app.put("/blogs/:id" , function(req , res){
    blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE

app.delete("/blogs/:id" , function(req , res){
  blog.findByIdAndRemove(req.params.id , function(err){
      if(err){
        res.redirect("/blogs");
      }else{
        res.redirect("/blogs");
      }
  });
});












app.listen(3000 , function(){
    console.log("Server has started");
})