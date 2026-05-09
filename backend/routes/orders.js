const express = require("express")
const Order = require("../models/Order")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { items, totalAmount, orderType, deliveryAddress, notes } = req.body

    const order = new Order({
      customer: req.user._id,
      items,
      totalAmount,
      orderType,
      deliveryAddress,
      notes,
    })

    await order.save()
    await order.populate("items.menuItem customer")

    // Emit to admin
    req.io.to("admin").emit("new-order", order)

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate("items.menuItem").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get order by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.menuItem customer")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user owns the order or is admin
    if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
