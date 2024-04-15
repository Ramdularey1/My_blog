const {Schema, model} = require("mongoose");
const { createHmac, randomBytes } = require('node:crypto');
const { use } = require("../routes/user.router");
const { createTokenForUser } = require("../authentication/authentication");

const userSchema = new Schema({

    fullname:{
        type:String,
        require: true,
    },
    
   email: {
        type:String,
        require: true,
        unique: true

    },
    salt: {
        type:String,
       
         
    },
    password: {
        type:String,
        require: true,

    },
    profileImageURL: {
        type:String,
        default: "/image/download.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }



},{timestamps:true});

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");
    

    this.password = hashedPassword;
    this.salt = salt;
    next();
})

userSchema.static("matchPasswordAndGenerateToken", async function (email, password){
    const user = await this.findOne({email});
    if(!user) throw new error("User not found");
    console.log("hello User",user)
   
    const salt = user.salt;
    const hashedPassword = user.password;

   const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

   if(userProvidedHash!== hashedPassword)throw new error("Incorrect Password");

   const token = createTokenForUser(user);
     
   return token;
})


const User = model("user",userSchema);
module.exports = User