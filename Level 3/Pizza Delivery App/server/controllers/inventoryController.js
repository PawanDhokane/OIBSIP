const Inventory = require("../models/Inventory");

exports.addInventory = async (req, res) => {
  try {
    // 1. Get data from req.body
    const { itemType, name, quantity, price } = req.body;

    if (!itemType || !name || quantity == null || price == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Create inventory item
    const item = await Inventory.create({
      name,
      itemType,
      quantity,
      price,
    });

    // 3. Send success response
    res.status(201).json({
      success: true,
      message: "Item added successfully!",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    // 1. Get all items from database
    const items = await Inventory.find();

    // 2. Send response with items
    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully!",
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    // 1. Get item ID from URL params
    const { id } = req.params;

    // 2. Get update data from body
    const { itemType, name, quantity, threshold, price } = req.body;

    // 3. Find and update the item
    const item = await Inventory.findByIdAndUpdate(
      id,
      { itemType, name, quantity, threshold, price },
      { new: true },
    );
    // { new: true } returns the UPDATED item, not the old one

    // 4. Check if item exists
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // 5. Send success response with updated item
    res.status(200).json({
      success: true,
      message: "Item updated successfully!",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item deleted successfully!",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
