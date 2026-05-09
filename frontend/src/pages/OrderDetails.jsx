"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Clock, Package, CheckCircle, XCircle, MapPin, Phone } from "lucide-react"
import toast from "react-hot-toast"
import axiosClient from "../utils/axiosClient"

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      const response = await axiosClient.get(`/api/orders/${id}`)
      setOrder(response.data)
    } catch (error) {
      toast.error("Failed to fetch order details")
      navigate("/orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "Preparing":
        return <Package className="h-6 w-6 text-blue-500" />
      case "Ready":
      case "Completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "Cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
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

  const getStatusSteps = () => {
    const steps = ["Pending", "Preparing", "Ready", "Completed"]
    const currentIndex = steps.indexOf(order.status)

    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Order not found</h2>
          <button onClick={() => navigate("/orders")} className="btn-primary">
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps()

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/orders")}
            className="mr-4 p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Order #{order._id.slice(-8)}</h1>
            <p className="text-secondary-600">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Order Status</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={getStatusClass(order.status)}>{order.status}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                {statusSteps.map((step, index) => (
                  <div key={step.name} className="flex items-center">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-primary-500 text-white" : "bg-secondary-200 text-secondary-500"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <p
                        className={`font-medium ${
                          step.current
                            ? "text-primary-600"
                            : step.completed
                              ? "text-secondary-900"
                              : "text-secondary-500"
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
                    <img
                      src={item.menuItem.image || "/placeholder.svg"}
                      alt={item.menuItem.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary-900">{item.menuItem.name}</h3>
                      <p className="text-sm text-secondary-600">{item.menuItem.category}</p>
                      <p className="text-sm text-secondary-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹{item.price}</p>
                      <p className="text-sm text-secondary-600">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t border-secondary-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-500">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Payment Status:</span> {order.paymentStatus}
                </p>
                <p>
                  <span className="font-medium">Order Type:</span> {order.orderType}
                </p>
                {order.paymentId && (
                  <p>
                    <span className="font-medium">Payment ID:</span> {order.paymentId}
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            {order.orderType === "delivery" && order.deliveryAddress && (
              <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Delivery Information</h2>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-secondary-500 mt-1" />
                  <div>
                    <p className="text-sm text-secondary-900">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Customer Information</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {order.customer.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.customer.email}
                </p>
                {order.customer.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-secondary-500" />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            {order.notes && (
              <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Special Instructions</h2>
                <p className="text-sm text-secondary-600">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
