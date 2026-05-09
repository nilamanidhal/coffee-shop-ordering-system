"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import MenuCard from "../components/MenuCard"
import { Search, Filter } from "lucide-react"
import toast from "react-hot-toast"
import axiosClient from "../utils/axiosClient"

const Menu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterItems()
  }, [menuItems, selectedCategory, searchTerm])

  const fetchMenuItems = async () => {
    try {
      const response = await axiosClient.get("/api/menu")
      setMenuItems(response.data)
      setLoading(false)
    } catch (error) {
      toast.error("Failed to fetch menu items")
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/api/menu/categories/all")
      setCategories(["All", ...response.data])
    } catch (error) {
      console.error("Failed to fetch categories")
    }
  }

  const filterItems = () => {
    let filtered = menuItems

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredItems(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Our Menu</h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Discover our carefully crafted selection of premium coffees, refreshing beverages, and delicious snacks.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-secondary-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-secondary-600">No items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu
