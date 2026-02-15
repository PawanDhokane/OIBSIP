const Inventory = require("../models/Inventory");

exports.getIngredientsByType = async (req, res) => {
  try {
    // 1. Get type from query params
    // Example: /api/pizza/ingredients?type=base
    const { type } = req.query;

    // 2. Find all items with that type
    const items = await Inventory.find({ itemType: type });

    // 3. Send response
    res.status(200).json({
      success: true,
      message: `${type} fetched successfully!`,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.calculatePrice = async (req, res) => {
  try {
    const { baseId, sauceId, cheeseId, veggieIds } = req.body;

    // 1. Find base, sauce, cheese by ID
    const base = await Inventory.findById(baseId);
    const sauce = await Inventory.findById(sauceId);
    const cheese = await Inventory.findById(cheeseId);

    // 2. Find all veggies (it's an array of IDs)
    const veggies = await Inventory.find({ _id: { $in: veggieIds } });
    // $in finds all items whose _id is IN the array

    if (!base || !sauce || !cheese) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory item selected",
      });
    }

    // 3. Calculate total price
    const total_price =
      base.price +
      sauce.price +
      cheese.price +
      veggies.reduce((sum, v) => sum + v.price, 0);

    // 4. Send response with total
    res.status(200).json({
      success: true,
      totalPrice: total_price,
      breakdown: {
        base: base.price,
        sauce: sauce.price,
        cheese: cheese.price,
        veggies: veggies.reduce((sum, v) => sum + v.price, 0),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
