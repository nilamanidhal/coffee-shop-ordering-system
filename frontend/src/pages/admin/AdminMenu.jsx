"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, Search, Filter, X } from "lucide-react"
import toast from "react-hot-toast"
import axiosClient from "../../utils/axiosClient"

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Hot Drinks",
    available: true,
    ingredients: [],
  })
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const categories = ["All", "Hot Drinks", "Cold Beverages", "Snacks"]

  useEffect(() => {
    fetchMenuItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [menuItems, searchTerm, categoryFilter])

  const fetchMenuItems = async () => {
    try {
      const response = await axiosClient.get("/api/admin/menu")
      setMenuItems(response.data)
    } catch (error) {
      toast.error("Failed to fetch menu items")
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = menuItems

    if (categoryFilter !== "All") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("description", formData.description)
      submitData.append("price", formData.price)
      submitData.append("category", formData.category)
      submitData.append("available", formData.available)
      submitData.append("ingredients", JSON.stringify(formData.ingredients))

      if (imageFile) {
        submitData.append("image", imageFile)
      }

      if (editingItem) {
        await axiosClient.put(`/api/admin/menu/${editingItem._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Menu item updated successfully")
      } else {
        await axiosClient.post("/api/admin/menu", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Menu item added successfully")
      }

      fetchMenuItems()
      resetForm()
      setShowModal(false)
    } catch (error) {
      toast.error("Failed to save menu item")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
      ingredients: item.ingredients || [],
    })
    setImageFile(null)
    setShowModal(true)
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return
    }

    try {
      await axios.delete(`/api/admin/menu/${itemId}`)
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId))
      toast.success("Menu item deleted successfully")
    } catch (error) {
      toast.error("Failed to delete menu item")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Hot Drinks",
      available: true,
      ingredients: [],
    })
    setImageFile(null)
    setEditingItem(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Menu Management</h1>
            <p className="text-secondary-600">Add, edit, and manage your menu items</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
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
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field">
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
              <div key={item._id} className="card group">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-secondary-900">{item.name}</h3>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => handleEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-secondary-600 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-500">₹{item.price}</span>
                    <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-secondary-600">No menu items found matching your criteria.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                <h2 className="text-xl font-semibold text-secondary-900">
                  {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="Hot Drinks">Hot Drinks</option>
                      <option value="Cold Beverages">Cold Beverages</option>
                      <option value="Snacks">Snacks</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="input-field" />
                  {!editingItem && (
                    <p className="text-xs text-secondary-500 mt-1">Leave empty to use placeholder image</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-secondary-700">Available for order</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {submitting ? <div className="loading-spinner"></div> : editingItem ? "Update" : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMenu
