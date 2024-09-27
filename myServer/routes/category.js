const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/category");

// Categories CRUD

// Get all categories
router.get("/", (req, res) => {
    CategoryModel.find()
      .then(data => res.send(data))
      .catch(err => res.status(500).send("Sorry, can't retrieve categories"));
});

// Get category by ID
router.get("/:id", (req, res) => {
    const categoryId = req.params.id;
    CategoryModel.findById(categoryId)
      .then(category => category ? res.send(category) : res.status(404).send("Can't find category with this id!"))
      .catch(err => res.status(500).send("Error retrieving category data"));
});

// Export the router
module.exports = router;
