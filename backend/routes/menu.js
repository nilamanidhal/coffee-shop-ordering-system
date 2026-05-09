const express = require("express")
const MenuItem = require("../models/MenuItem")

const router = express.Router()

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query
    const query = { available: true }

    if (category) {
      query.category = category
    }

    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    const menuItems = await MenuItem.find(query).sort({ createdAt: -1 })
    res.json(menuItems)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get menu item by ID
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" })
    }
    res.json(menuItem)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get categories
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category")
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
