const express = require('express');
const router = express.Router();
const {
  getIngredientsByType,
  calculatePrice
} = require('../controllers/pizzaController');

// Add routes here
// GET /ingredients?type=base
// POST /calculate-price

router.get('/ingredients', getIngredientsByType);
router.post('/calculate-price', calculatePrice);

module.exports = router;