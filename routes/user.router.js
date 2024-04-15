const { Router } = require("express");
const User = require("../models/user.model");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Set cookie and then redirect
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    // If error occurs during sign-in, render the signin template with an error message
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req,res) => {
  res.clearCookie('token').redirect('/')
})

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const user = await User.create({
      fullname,
      email,
      password,
    });
    
   
    return res.redirect("/");
  } catch (error) {
    
    return res.render("signup", {
      error: "An error occurred during sign up.",
    });
  }
});

module.exports = router;
