require('dotenv').config();
const path = require("path")
const express = require("express")
const userRoute = require("./routes/user.router")
const blogRouter = require("./routes/blog.router")
const Blog = require("./models/blogs.model")
const mongoose = require("mongoose")
const cookiePaser = require("cookie-parser")
const { checkForAuthenticationCookie } = require("./middleware/authentication")

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB connected"));

//mongodb+srv://ramdulareyyadav803:youtube2002@cluster0.by4pvzn.mongodb.net/blogsite

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}))
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))
app.get("/", async(req,res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs: allBlogs
    })
});

app.use("/user", userRoute);
app.use("/blog", blogRouter)


app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
}) 
 