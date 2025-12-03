import createHttpError from "http-errors";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { User } from "../models/user.js";

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
