const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { pizzaBase, sauce, cheese, veggies, totalPrice } = req.body;

    // Check stock availability
    const base = await Inventory.findById(pizzaBase);
    const sauceItem = await Inventory.findById(sauce);
    const cheeseItem = await Inventory.findById(cheese);
    const veggieItems = await Inventory.find({ _id: { $in: veggies } });

    if (!base || base.quantity < 1) {
      return res.status(400).json({ success: false, message: 'Base out of stock' });
    }
    if (!sauceItem || sauceItem.quantity < 1) {
      return res.status(400).json({ success: false, message: 'Sauce out of stock' });
    }
    if (!cheeseItem || cheeseItem.quantity < 1) {
      return res.status(400).json({ success: false, message: 'Cheese out of stock' });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      pizzaBase: base.name,
      sauce: sauceItem.name,
      cheese: cheeseItem.name,
      veggies: veggieItems.map(v => v.name),
      totalPrice,
      status: 'received',
      paymentStatus: 'pending'
    });

    // Reduce stock
    base.quantity -= 1;
    sauceItem.quantity -= 1;
    cheeseItem.quantity -= 1;
    await base.save();
    await sauceItem.save();
    await cheeseItem.save();

    for (let veggie of veggieItems) {
      veggie.quantity -= 1;
      await veggie.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};