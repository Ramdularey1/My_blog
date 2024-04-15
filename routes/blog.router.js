const { Router } = require("express");
const multer = require("multer")
const path = require("path")

const Blog = require("../models/blogs.model")
const Comment = require("../models/comments.model")

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads/`)
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
  const upload = multer({ storage: storage })



router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    })
})

router.get("/:id", async(req,res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comment = await Comment.find({blogId: req.params.id}).populate("createdBy");
  // console.log("blogss",blog);
  // console.log(comment)
  return res.render("blogs",{
    user:req.user,
    blog,
    comment,
  })
})

router.post("/comment/:blogId", async(req, res) => {
  await Comment.create({
    content:req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/", upload.single('coverImage'), async(req,res) => {
    
    const {title, body} = req.body;
  const blog =   await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    console.log("myblog",blog);
    // return res.redirect(`/blog/${blog._id}`)
    return res.redirect('/')
})


module.exports = router;