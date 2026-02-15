const express = require('express');
const router = express.Router();
const {
  addInventory,
  getAllInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

   router.post('/', protect, admin, addInventory);
   router.get('/', getAllInventory);
   router.put('/:id', protect, admin, updateInventory);
   router.delete('/:id', protect, admin, deleteInventory);

module.exports = router;