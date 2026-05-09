const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const MenuItem = require("../models/MenuItem")
const Order = require("../models/Order")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: "djsdp7cns",
  api_key: "762634922971518",
  api_secret: "wvat-Ki2sf4pFpLbPLe2eGuxh7g",
})

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Get all menu items (including unavailable)
router.get("/menu", adminAuth, async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 })
    res.json(menuItems)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add menu item
router.post("/menu", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, ingredients } = req.body

    let imageUrl = "/placeholder.svg?height=200&width=200"

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "coffee-shop" }, (error, result) => {
              if (error) reject(error)
              else resolve(result)
            })
            .end(req.file.buffer)
        })
        imageUrl = result.secure_url
      } catch (uploadError) {
        console.log("Image upload failed, using placeholder")
      }
    }

    const menuItem = new MenuItem({
      name,
      description,
      price: Number.parseFloat(price),
      category,
      image: imageUrl,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
    })

    await menuItem.save()
    res.status(201).json(menuItem)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update menu item
router.put("/menu/:id", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, available, ingredients } = req.body

    const updateData = {
      name,
      description,
      price: Number.parseFloat(price),
      category,
      available: available === "true",
      ingredients: ingredients ? JSON.parse(ingredients) : [],
    }

    // Upload new image if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "coffee-shop" }, (error, result) => {
              if (error) reject(error)
              else resolve(result)
            })
            .end(req.file.buffer)
        })
        updateData.image = result.secure_url
      } catch (uploadError) {
        console.log("Image upload failed, keeping existing image")
      }
    }

    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true })

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" })
    }

    res.json(menuItem)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete menu item
router.delete("/menu/:id", adminAuth, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id)
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" })
    }
    res.json({ message: "Menu item deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all orders
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const { status } = req.query
    const query = {}

    if (status) {
      query.status = status
    }

    const orders = await Order.find(query)
      .populate("customer", "name email phone")
      .populate("items.menuItem")
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update order status
router.put("/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("customer", "name email")
      .populate("items.menuItem")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Emit status update to customer
    req.io.emit(`order-${order._id}`, { status })

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get analytics
router.get("/analytics", adminAuth, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const [totalOrders, todayOrders, monthOrders, totalRevenue, todayRevenue, monthRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisMonth }, paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ])

    res.json({
      totalOrders,
      todayOrders,
      monthOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
