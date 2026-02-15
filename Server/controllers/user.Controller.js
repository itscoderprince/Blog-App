import { handleError } from "../helpers/handleError.js";
import User from "../models/userModel.js";
import { uploadOnCloudinary } from "../helpers/cloudinary.js";
import bcrypt from "bcryptjs";

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId }).lean().exec();
    if (!user) return next(handleError(404, "User not found ❌"));

    res.status(200).json({
      success: true,
      message: "User found 🎉",
      user,
    });

  } catch (error) {
    next(handleError(500, error.message));
  }
};


export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, bio, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(handleError(404, "User not found ❌"));

    if (newPassword) {
      if (!currentPassword) return next(handleError(400, "Current password is required to change password ⚠"));

      const isMatched = await bcrypt.compare(currentPassword, user.password);
      if (!isMatched) return next(handleError(401, "Invalid current password ❌"));

      user.password = bcrypt.hashSync(newPassword, 10);
    }

    // Handle Avatar Upload
    if (req.file) {
      const upload = await uploadOnCloudinary(req.file.path);
      if (upload) {
        user.avatar = upload.secure_url;
      }
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully 🎉",
      user: rest,
    });

  } catch (error) {
    next(handleError(500, error.message));
  }
};