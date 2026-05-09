"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import axiosClient from "../utils/axiosClient"

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState("pickup")
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (orderType === "delivery" && !deliveryAddress.trim()) {
      toast.error("Please provide a delivery address")
      return
    }

    setLoading(true)

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getCartTotal(),
        orderType,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
        notes,
      }

      const response = await axiosClient.post("/api/orders", orderData)
      const order = response.data

      // Clear cart and navigate to payment
      clearCart()
      navigate(`/payment/${order._id}`)
    } catch (error) {
      toast.error("Failed to place order")
      console.error("Order error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Your cart is empty</h2>
          <p className="text-secondary-600 mb-6">Add some delicious items to get started!</p>
          <button onClick={() => navigate("/menu")} className="btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="card flex items-center space-x-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900">{item.name}</h3>
                  <p className="text-sm text-secondary-600">{item.category}</p>
                  <p className="text-lg font-bold text-primary-500">₹{item.price}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="p-1 rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-secondary-900 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="p-1 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h3>

              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-secondary-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-500">₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Order Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Order Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="pickup"
                        checked={orderType === "pickup"}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="mr-2"
                      />
                      Pickup
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="delivery"
                        checked={orderType === "delivery"}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="mr-2"
                      />
                      Delivery
                    </label>
                  </div>
                </div>

                {orderType === "delivery" && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="input-field"
                      rows="3"
                      placeholder="Enter your delivery address"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Special Instructions</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                    rows="2"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? <div className="loading-spinner"></div> : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
