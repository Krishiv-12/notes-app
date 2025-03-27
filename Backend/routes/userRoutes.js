import express from 'express'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Signup (Register User)

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // ✅ Generate JWT Token
        const token = generateToken(newUser._id);

        res.status(201).json({
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ✅ Login (Authenticate User)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Password Check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ✅ Get User Profile (Protected Route)
router.get("/profile", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // ❌ Password Hide Karo
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get Profile Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  // ✅ Update User Profile (Protected Route)
  router.put("/profile", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.name = req.body.name || user.name;
  
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
  
      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  

export default router;