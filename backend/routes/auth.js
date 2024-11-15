import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Route for Registration
router.post('/register', async (req, res) => {
  const { username, email, name, password } = req.body;
  try {
    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
      username,
      email,
      name,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Route for Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Wrong username or password!' });
    }

    // Check if the password matches the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Wrong username or password!' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Exclude sensitive fields
    const { password: _, isAdmin, ...otherDetails } = user._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ message: 'Login successful', user: otherDetails });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;