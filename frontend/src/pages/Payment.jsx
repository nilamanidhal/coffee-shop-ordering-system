"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { CreditCard, Lock, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import axiosClient from "../utils/axiosClient"

const Payment = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await axiosClient.get(`/api/orders/${orderId}`)
      setOrder(response.data)
    } catch (error) {
      toast.error("Order not found")
      navigate("/orders")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setProcessing(true)

    try {
      // Create payment order
      const paymentResponse = await axiosClient.post("/api/payment/create-order", {
        orderId: order._id,
      })

      // Simulate payment processing (demo)
      setTimeout(async () => {
        try {
          // Verify payment
          await axiosClient.post("/api/payment/verify", {
            orderId: order._id,
            paymentId: `pay_${Date.now()}`,
          })

          setPaymentSuccess(true)
          toast.success("Payment successful!")

          // Redirect to order details after 3 seconds
          setTimeout(() => {
            navigate(`/orders/${order._id}`)
          }, 3000)
        } catch (error) {
          toast.error("Payment verification failed")
          setProcessing(false)
        }
      }, 2000)
    } catch (error) {
      toast.error("Payment failed")
      setProcessing(false)
    }
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

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Payment Successful!</h2>
          <p className="text-lg text-secondary-600 mb-6">
            Your order has been confirmed and payment processed successfully.
          </p>
          <p className="text-sm text-secondary-500 mb-8">Redirecting to order details...</p>
          <button onClick={() => navigate(`/orders/${order._id}`)} className="btn-primary">
            View Order Details
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Complete Payment</h1>
          <p className="text-secondary-600">Secure payment for your coffee order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">
                    {item.menuItem.name} x{item.quantity}
                  </span>
                  <span className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-secondary-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary-500">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-secondary-600">
              <p>
                <strong>Order Type:</strong> {order.orderType}
              </p>
              <p>
                <strong>Order ID:</strong> #{order._id.slice(-8)}
              </p>
              {order.deliveryAddress && (
                <p>
                  <strong>Delivery Address:</strong> {order.deliveryAddress}
                </p>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-secondary-900">Secure Payment</h2>
            </div>

            {/* Demo Payment Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">Demo Payment Mode</h3>
              <p className="text-sm text-yellow-700">
                This is a demo payment system. No real money will be charged. Click "Pay Now" to simulate a successful
                payment.
              </p>
            </div>

            {/* Mock Payment Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value="4111 1111 1111 1111"
                    readOnly
                    className="input-field pr-10 bg-secondary-50"
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Expiry Date</label>
                  <input type="text" value="12/25" readOnly className="input-field bg-secondary-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">CVV</label>
                  <input type="text" value="123" readOnly className="input-field bg-secondary-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Cardholder Name</label>
                <input type="text" value="Demo User" readOnly className="input-field bg-secondary-50" />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Pay ₹{order.totalAmount.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-secondary-500">Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
