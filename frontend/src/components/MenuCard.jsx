"use client"
import { Plus, Minus } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

const MenuCard = ({ item }) => {
  const { addToCart, cartItems, updateQuantity } = useCart()
  const { user } = useAuth()

  const cartItem = cartItems.find((cartItem) => cartItem._id === item._id)
  const quantity = cartItem ? cartItem.quantity : 0

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart")
      return
    }
    addToCart(item)
  }

  const handleUpdateQuantity = (newQuantity) => {
    if (!user) return
    updateQuantity(item._id, newQuantity)
  }

  return (
    <div className="card group hover:scale-105 transition-transform duration-200">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover rounded-lg" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-secondary-900">{item.name}</h3>
        <p className="text-sm text-secondary-600 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-500">₹{item.price}</span>
          <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded-full">{item.category}</span>
        </div>

        {user && (
          <div className="flex items-center justify-between pt-2">
            {quantity > 0 ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  className="p-1 rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors duration-200"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-medium text-secondary-900">{quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  className="p-1 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={handleAddToCart} className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuCard
