const express = require("express");
const server = express();
const UserModel = require("../models/user"); 
const bcrypt = require('bcrypt');
const IdCounterModel = require("../models/idCounter");
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken package
const router = express.Router(); // This initializes the router
const { isAuthenticated } = require('../middleware/auth'); 

server.use(express.json()); 

// Users CRUD
// Get all users
router.get("/", isAuthenticated, (req, res) => {
    UserModel.find()
      .then(data => res.json({ message: "Users retrieved successfully", data }))
      .catch(err => {
          console.error("Error retrieving users:", err);
          res.status(500).json({ message: "Sorry, can't retrieve users" });
      });
});
  
// Get user by ID
router.get("/getUserById/:id", isAuthenticated, function(req, res) {
    const userId = +req.params.id;
    UserModel.findOne({ id: userId })
    .then((user) => {
      if (user) {
        res.json({ message: "User retrieved successfully", user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error("Error retrieving user by ID:", err);
      res.status(500).json({ message: "Error retrieving user" });
    });
});
  
// Login route
// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.error("Login failed: User not found for email:", email);
            return res.status(401).send("Invalid email or password");
        }

        // Use the comparePassword method to check if passwords match
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.error("Login failed: Password mismatch for user:", email);
            return res.status(401).send("Invalid email or password");
        }

        // Successful login: create a JWT token including the user's role
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, // Include role
            '1234567', 
            { expiresIn: '1h' } // Adjust the secret and expiration as needed
        );
        
        // Send the token back to the client
        res.json({ token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Server error");
    }
});


// Create a new user
router.post("/createUser", async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email: req.body.email });

        if (existingUser) {
            // User already exists
            return res.status(409).send("You are already registered. Please sign in.");
        }

        // Find or create an ID counter for the User model
        const counter = await IdCounterModel.findOneAndUpdate(
            { modelName: 'User' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true } // Create if it doesn't exist
        );

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new UserModel({
            ...req.body,
            id: counter.seq, // Assign the incremented ID
            role: 'user',
            password: hashedPassword, // Save the hashed password
        });

        await newUser.save();
        res.status(201).send("User created successfully");
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(400).send("Error creating user");
    }
});

// Add this route after your user routes
router.get("/admin", isAuthenticated, (req, res) => {
    // Check if the user has an admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    
    // Your logic to handle admin functionality, e.g., sending admin data
    res.status(200).json({ message: 'Welcome to the admin dashboard', user: req.user });
});


module.exports = router;
