import createHttpError from "http-errors";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const updateUserAvatar = async(req, res) =>{

    if(!req.file){
        throw createHttpError(400, "No file");
    }

    const result = await saveFileToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(req.user._id, {avatar: result.secure_url}, {new: true});

    res.status(200).json({
        url: user.avatar
    });
};

export const getCurrentUser = async(req, res) =>{
    
    if (!req.user) {
        throw createHttpError(401, "User not authenticated."); 
    }

    res.status(200).json(req.user);
};
export const updateUser = async (req, res) => {
    const { username, email, password } = req.body;
    const updateData = {};

    if (username !== undefined) {
        updateData.username = username;
    }

    if (email !== undefined) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (existingUser) {
            throw createHttpError(409, "Email in use");
        }
        updateData.email = email;
    }

    if (password !== undefined) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        throw createHttpError(404, "User not found");
    }

    res.status(200).json({
        status: 200,
        message: "Successfully updated user!",
        data: updatedUser,
    });
};