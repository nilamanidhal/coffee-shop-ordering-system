"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, Clock, CheckCircle, Package, TrendingUp, Coffee, Star } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import axiosClient from "../utils/axiosClient"

const UserDashboard = () => {
  const { user } = useAuth()
  const [recentOrders, setRecentOrders] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategory: "Hot Drinks",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const ordersResponse = await axiosClient.get("/api/orders/my-orders")
      const orders = ordersResponse.data

      setRecentOrders(orders.slice(0, 5))

      // Calculate stats
      const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
      const categoryCount = {}

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const category = item.menuItem.category
          categoryCount[category] = (categoryCount[category] || 0) + item.quantity
        })
      })

      const favoriteCategory = Object.keys(categoryCount).reduce(
        (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
        "Hot Drinks",
      )

      setStats({
        totalOrders: orders.length,
        totalSpent,
        favoriteCategory,
      })
    } catch (error) {
      console.error("Failed to fetch user data:", error)
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

  const dashboardStats = [
    {
      name: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Total Spent",
      value: `₹${stats.totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Favorite Category",
      value: stats.favoriteCategory,
      icon: Coffee,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Member Since",
      value: new Date(user.createdAt || Date.now()).getFullYear(),
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Welcome back, {user.name}!</h1>
          <p className="text-secondary-600">Here's your coffee journey overview</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/menu" className="card hover:shadow-lg transition-shadow duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
                <Coffee className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Order Coffee</h3>
                <p className="text-sm text-secondary-600">Browse menu and place order</p>
              </div>
            </div>
          </Link>

          <Link to="/orders" className="card hover:shadow-lg transition-shadow duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">My Orders</h3>
                <p className="text-sm text-secondary-600">View order history</p>
              </div>
            </div>
          </Link>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Loyalty Points</h3>
                <p className="text-sm text-secondary-600">{stats.totalOrders * 10} points earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
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
            <Link to="/orders" className="text-primary-500 hover:text-primary-600 font-medium text-sm">
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
                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
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
              <p className="text-secondary-600 mb-4">No orders yet</p>
              <Link to="/menu" className="btn-primary">
                Order Your First Coffee
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
