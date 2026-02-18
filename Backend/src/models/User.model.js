import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    fullname: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength: 8
    },
    bio:{
        type:String,
        default:"",
    },
    profilePic:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type: String,
        default:""
    },
    learningLanguage:{
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: "",
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
},{timestamps:true})

//pre hook
UserSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

//methods
UserSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect
}

const userModel = mongoose.model("user",UserSchema);


export default userModel