import express from "express";
import { User, UserRegistration, EmailOptions } from "../types";
import { sendEmail, generateOtp } from "./verification";
import { Redis } from '@upstash/redis';
import { RegisterUser } from "../models/userModels";
import jwt from "jsonwebtoken";
const router = express.Router();
const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
})
const JWT_SECRET = process.env.JWT_SECRET
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(404).json({
            message: "Can't process your request.",
            data: "no data"
        })
        return;
    }
    const user = await RegisterUser.findOne({ email, password })
    if (!user) {
        res.status(404).json({
            message: "error, the user cant be found with email"
        })
        return;
    }
    if (!JWT_SECRET) {
        return;
    }
    const token = jwt.sign({ email, password }, JWT_SECRET, {
        expiresIn: '1h',
    });
    res.status(200).json({
        message: "Login sucessful.",
        token: token
    })

})
router.post("/verify", async (req, res) => {
    const { email, value, userData } = req.body;
    const otp = await redis.hget(email, "otp")

    if (otp == value) {
        res.status(200).json({
            message: "User verified with otp"
        })
        console.log("userdata: ", userData)
        try {
            const newuser = new RegisterUser({
                username: userData.username,
                email: userData.email,
                password: userData.password
            })
            await newuser.save();
            console.log("user saved into database.")
        } catch (e) {
            console.log("cant save user data.", e)
        }
        return;
    }
    res.status(404).json({
        message: "User can't be verified using otp"
    })
})
router.post("/register", async (req, res) => {
    const registerData: UserRegistration = req.body;
    if (!registerData) {
        res.status(400).json({
            message: "error while creating user."
        })
        return;
    }
    console.log("Request to create new user with: ", registerData)

    var otp: number;
    var otp = generateOtp();
    const emailOptions: EmailOptions = {
        to: registerData.email,
        subject: 'Verify your email for Github Clone',
        otp,
        html: 'Your OTP is <b>' + otp + '</b>. Please use this to verify your email.'
    }
    sendEmail(emailOptions).then(() => {
        redis.hset(registerData.email, {
            otp: otp
        })
        res.status(201).json({
            message: "User created successfully. Please check your email for OTP.",
            email: registerData.email,
            userData: registerData
        })
    }).catch((error) => {
        console.error("Error sending email:", error);
        res.status(500).json({
            message: "Failed to send verification email.",
            error: error.message
        })
    }
    )
    console.log("OTP sent to email:", registerData.email);

})
router.get("/profile", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(401).send("No token provided")
        return;
    }
    if(!JWT_SECRET){
        return;
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        res.json({
            user:decoded
        })
    }catch(e){
        res.status(403).json({
            message:"Token invalid or expired"
        })
    }
})

export default router