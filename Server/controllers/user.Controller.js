import User from "../models/userModel.js";
import { handleError } from "../helpers/handleError.js";
import { uploadOnCloudinary } from "../helpers/cloudinary.js";

/**
 * @description Get all users (Admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * @description Delete a user (Admin only)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves (optional but safe)
    if (id === req.user._id) {
      return next(handleError(400, "You cannot delete your own admin account."));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully! 🗑️",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * @description Update user role (Admin only)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return next(handleError(400, "Invalid role."));
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");

    if (!user) {
      return next(handleError(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      user,
      message: `User role updated to ${role} successfully! ⬆️`,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * @description Get a specific user by ID
 */
export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(handleError(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

/**
 * @description Update user profile
 */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(handleError(404, "User not found."));
    }

    // Authorization check
    if (user._id.toString() !== req.user._id && req.user.role !== 'admin') {
      return next(handleError(403, "You are not authorized to update this profile."));
    }

    let avatar = user.avatar;
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path, "mern_blog/avatars");
      if (cloudinaryResponse) {
        avatar = cloudinaryResponse.secure_url;
      }
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.avatar = avatar;

    await user.save();

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      user: rest,
      message: "Profile updated successfully! ✅",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};