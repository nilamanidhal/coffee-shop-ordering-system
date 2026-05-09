const express = require("express")
const Razorpay = require("razorpay")
const Order = require("../models/Order")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Initialize Razorpay (using test keys)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_demo",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "demo_secret",
})

// Create payment order
router.post("/create-order", auth, async (req, res) => {
  try {
    const { orderId } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Create Razorpay order (demo)
    const paymentOrder = {
      id: `pay_${Date.now()}`,
      amount: order.totalAmount * 100, // Convert to paise
      currency: "INR",
      status: "created",
    }

    res.json({
      orderId: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_demo",
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Verify payment (demo)
router.post("/verify", auth, async (req, res) => {
  try {
    const { orderId, paymentId } = req.body

    // In a real app, you would verify the payment signature
    // For demo purposes, we'll just mark it as completed

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "completed",
        paymentId: paymentId,
      },
      { new: true },
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
