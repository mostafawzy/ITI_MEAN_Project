const express = require("express");
const router = express.Router();
const ProductModel = require("../models/product");
const server = express();

server.use(express.json()); 


// Products CRUD
router.get("/", (req, res) => {
    ProductModel.find()
      .then(data => res.send(data))
      .catch(err => res.status(500).send("Sorry, can't retrieve data"));
  });
  
  
  router.get("/getProductById/:id", function (req, res) {
    var prodId = +req.params.id;
    ProductModel.find({ id: prodId })
      .then((product) => {
        if (product) {
          res.send(product);
        } else {
          res.send("cant find product with this id!");
        }
      })
      .catch((err) => {
        res.send("Error retrive Data");
      });
  });
  
  // Create a new product
  router.post("/createProduct", (req, res) => {
    const newProduct = new ProductModel(req.body); // Create a new instance of ProductModel with the data from the request body
  
    newProduct.save() // Save the new product to the database
      .then(() => res.status(201).send("Product created successfully")) // If successful, send a success message
      .catch(err => {
        console.error("Error creating product:", err); // Log the error for debugging
        res.status(400).send("Error creating product"); // Send error response
      });
  });
  
  // Get product by name
  router.get("/getProductByName", (req, res) => {
    const { name } = req.query; // Get the name from the query parameter
    // Check if the name is provided
    if (!name) {
      return res.status(400).send("Missing name query parameter");
    }
  
    ProductModel.find({ title: { $regex: name, $options: 'i' } }) // Use regex for case-insensitive search
      .then(products => res.send(products))
      .catch(err => {
        console.error("Error retrieving products:", err); // Log the error for debugging
        res.status(500).send("Error retrieving products");
      });
  });
  
  router.delete('/deleteProduct/:id', function (req, res) {
    var prodId = +req.params.id;
    ProductModel.deleteOne({ id: prodId })
        .then((result) => {
            // Send a JSON response
            res.json({ message: "Deleted successfully" });
        })
        .catch((err) => {
            res.status(500).json({ error: "Error deleting product with this id" });
        });
  });
  
  // Update a product
  router.put("/updateProduct/:id", (req, res) => {
    const prodId = +req.params.id; // Get the product ID from the request parameters
    ProductModel.findOneAndUpdate({ id: prodId }, req.body, { new: true }) // Find the product and update it
      .then(updatedProduct => {
        if (updatedProduct) {
          res.send(updatedProduct); // Send the updated product as a response
        } else {
          res.status(404).send("Product not found"); // Handle case where product is not found
        }
      })
      .catch(err => {
        console.error("Error updating product:", err); // Log the error for debugging
        res.status(500).send("Error updating product"); // Send error response
      });
  });
  
  module.exports = router;
  