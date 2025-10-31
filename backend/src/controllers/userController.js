const userModel = require("../models/userModel");

const createUser = async (req, res) => {
    try {
        const { uid, email, username } = req.body;
        if (!uid || !email || !username) return res.status(400).json({success: false, message: "Uid, email or username is missing."});
        let user = await userModel.findOne({ uid });
        if (!user) {
            user = await userModel.create({
                uid,
                email,
                username
            })
            return res.status(201).json({success: true, message: "User created successfully.", user: user});
        }
        return res.status(200).json({success: false, message: "User already exists.", user: user});
    }
    catch (err) {
        return res.status(500).json({success: false, message: "Server error...", error: err.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const { uid, email, username } = req.body;
        if (!uid || !email || !username) return res.status(400).json({success: false, message: "Uid, email or username is missing."});
        let user = await userModel.findOne({ uid });
        if (user) return res.status(200).json({success: true, message: "Login successful.", user: user});
        return res.status(404).json({success: false, message: "Invalid Credentials"});
    }
    catch (err) {
        return res.status(500).json({success: false, message: "Server error...", error: err.message});
    }
}

const completeUserDetails = async (req, res) => {
    try {
        const { uid, username, email, number } = req.body;
        if (!uid) return res.status(400).json({success: false, message: "Uid not found..."});
        if (!username || !number || !email) return res.status(400).json({success: false, message: "All fields are required."});
        const user = await userModel.findOneAndUpdate({ uid }, { username, email, number }, {new: true});
        if(!user) return res.status(404).json({success: false, message: "User not found..."});
        return res.status(200).json({success: true, message: "User profile updated successfully.", user: user});
    }
    catch(err){
        return res.status(500).json({success: false, message: "Server error...", error: err.message});
    }
}

module.exports = { createUser, completeUserDetails, loginUser }