const express = require("express");
const router = express.Router();
const Cart = require('../models/cart');
const server = express();
const Product = require('../models/product'); // Adjust the path as necessary


server.use(express.json()); 

const { isAuthenticated } = require('../middleware/auth'); // Adjust the path as necessary

// Add item to cart
// Add item to cart
router.post('/add', isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Assuming you have the user info in req.user

  try {
    const product = await Product.findById(productId); // Find the product
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ userId });
    console.log('Cart found:', cart);

    if (cart) {
      // If cart exists, check if the item is already in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        // Update the existing item
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].total = cart.items[itemIndex].quantity * product.price;
      } else {
        // Add a new item to the cart
        cart.items.push({
          productId,
          name: product.title,
          price: product.price,
          quantity,
          total: quantity * product.price
        });
      }
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);
      await cart.save();
    } else {
      console.log('Creating new cart...');
      // Create a new cart if it doesn't exist
      const newCart = new Cart({
        userId,
        items: [{
          productId,
          name: product.title,
          price: product.price,
          quantity,
          total: quantity * product.price
        }],
        totalPrice: quantity * product.price
      });
      await newCart.save();
    }

    console.log("Cart after addition:", cart);
    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    console.error('Error in /cart/add:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
  // Get user's cart
  router.get('/', isAuthenticated, async (req, res) => {
    const userId = req.user._id;
  
    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId'); // Populate to get product details
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Remove item from cart
  router.delete('/remove/:productId', isAuthenticated, async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Filter out the item to remove
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);
      await cart.save();
  
      res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;
  