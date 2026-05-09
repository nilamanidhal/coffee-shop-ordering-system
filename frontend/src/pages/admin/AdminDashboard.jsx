"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { ShoppingBag, Coffee, TrendingUp, Clock, CheckCircle, Package, DollarSign } from "lucide-react"
import axiosClient from "../../utils/axiosClient"

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    todayOrders: 0,
    monthOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    monthRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchRecentOrders()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axiosClient.get("/api/admin/analytics")
      setAnalytics(response.data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      const response = await axiosClient.get("/api/admin/orders?limit=5")
      setRecentOrders(response.data.slice(0, 5))
    } catch (error) {
      console.error("Failed to fetch recent orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Preparing":
        return <Package className="h-4 w-4 text-blue-500" />
      case "Ready":
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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

  const stats = [
    {
      name: "Total Orders",
      value: analytics.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Today Orders",
      value: analytics.todayOrders,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Total Revenue",
      value: `₹${analytics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Today Revenue",
      value: `₹${analytics.todayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
          <p className="text-secondary-600">Manage your coffee shop operations</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/orders" className="card hover:shadow-lg transition-shadow duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Manage Orders</h3>
                <p className="text-sm text-secondary-600">View and update order status</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/menu" className="card hover:shadow-lg transition-shadow duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                <Coffee className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Manage Menu</h3>
                <p className="text-sm text-secondary-600">Add, edit, or remove items</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/analytics" className="card hover:shadow-lg transition-shadow duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Analytics</h3>
                <p className="text-sm text-secondary-600">View detailed reports</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-500 hover:text-primary-600 font-medium text-sm">
              View All
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-secondary-900">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-secondary-600">
                        {order.customer.name} • {order.items.length} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹{order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-secondary-600">{order.orderType}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={getStatusClass(order.status)}>{order.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-600">No recent orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
