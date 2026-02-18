import { upsertStreamUser } from "../lib/stream.js";
import userModel from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const SignUp = async (req,res) => {
    const {email, password , fullname} = req.body;

    try{
        if(!email || !password || !fullname){
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 8){
            return res.status(400).json({message: "Password must be at least 8 characters."})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already registered"})
        };

        const idx = Math.floor(Math.random()*99)+1;
        const RandomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

        const newUser = await userModel.create({
            email, fullname , password , profilePic: RandomAvatar
        })

        upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePic || ""
        })
        .then(() => {
            console.log(`Stream user created for ${newUser.fullname}`);
        })
        .catch((err) => {
            console.error("Stream sync failed:", err.message);
        });


        const token = jwt.sign({userID:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })
        res.cookie("jwt",token,{
            maxAge: 1000*60*60*24*7,
            httpOnly:true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            success:true,
            newUser
        });

    }catch(err){
        console.log("error in signUp controller",err);
        res.status(500).json({message:"internal server error"});
    }
};

export const LogIn = async (req,res) => {
    const {email , password} = req.body
    try{
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid Email or Password "})
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({ message: "Invalid email or Password"})
        }

        const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })
        res.cookie("jwt",token,{
            maxAge: 1000*60*60*24*7,
            httpOnly:true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({success:true, message: "user login successfully", user})
        
    }catch(err){
        console.log("error in login controller",err);
        res.status(500).json({message:"internal server error"});
    }
};

export const LogOut = async (req,res) => {
    res.clearCookie("jwt")
    res.status(200).json({success: true, message:"Log Out successfully"})
}

export const onboard = async (req, res) => {
    try{
        const userId = req.user._id
        const {fullname, bio , nativeLanguage, learningLanguage, location} = req.body

        if(!fullname || !bio  || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message: "all Fields are required",
            missingField: [
                !fullname && "fullname",
                !bio && "bio",
                !nativeLanguage && "nativeLanguage",
                !learningLanguage && "learningLanguage",
                !location && "location"
            ].filter(Boolean)
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded: true
        }, {new:true})

        if(!updatedUser){
            return res.status(404).json({message:"user not found"})}

        try{
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullname,
                image: updatedUser.profilePic || ""
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`)

        }catch(err){
            console.error(`error updating stream user during onboarding: ${err}`)

        }
    
        res.status(200).json({
            success:true, user: updatedUser
        })

        }catch(err){
            console.error("onboarding error:", err)
            res.status(500).json({message: "internal server error"})
        }
}