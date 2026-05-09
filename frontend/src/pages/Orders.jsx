"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Clock, Package, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import axiosClient from "../utils/axiosClient"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axiosClient.get("/api/orders/my-orders")
      setOrders(response.data)
    } catch (error) {
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Preparing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "Ready":
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Preparing":
        return "status-preparing"
      case "Ready":
        return "status-ready"
      case "Completed":
        return "status-completed"
      case "Cancelled":
        return "status-cancelled"
      default:
        return "status-pending"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-24 w-24 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">No orders yet</h2>
          <p className="text-secondary-600 mb-6">Start by ordering something delicious!</p>
          <Link to="/menu" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-secondary-600">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={getStatusClass(order.status)}>{order.status}</span>
                  {getStatusIcon(order.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.menuItem.name} x{item.quantity}
                        </span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">Order Details:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Type:</span> {order.orderType}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Payment:</span> {order.paymentStatus}
                    </p>
                    {order.deliveryAddress && (
                      <p>
                        <span className="font-medium">Address:</span> {order.deliveryAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-secondary-200">
                <div className="text-lg font-bold text-primary-500">Total: ₹{order.totalAmount.toFixed(2)}</div>
                <Link to={`/orders/${order._id}`} className="btn-secondary text-sm">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
