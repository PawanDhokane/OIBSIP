const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pizzaBase: {
      type: String,
      required: true,
    },
    sauce: {
      type: String,
      required: true,
    },
    cheese: {
      type: String,
      required: true,
    },
    veggies: {
      type: [String],
      default: [],
    },
    totalPrice: {
      required: true,
      type: Number,
    },
    status: {
      type: String,
      enum: ["received", "in-kitchen", "out-for-delivery", "delivered"],
      default: "received",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
