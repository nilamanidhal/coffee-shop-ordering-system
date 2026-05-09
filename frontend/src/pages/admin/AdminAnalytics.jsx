"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { TrendingUp, DollarSign, ShoppingBag, Clock, Calendar } from "lucide-react"
import axiosClient from "../../utils/axiosClient"

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    todayOrders: 0,
    monthOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    monthRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axiosClient.get("/api/admin/analytics")
      setAnalytics(response.data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
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
      change: null,
    },
    {
      name: "Today Orders",
      value: analytics.todayOrders,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: null,
    },
    {
      name: "This Month Orders",
      value: analytics.monthOrders,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: null,
    },
    {
      name: "Total Revenue",
      value: `₹${analytics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: null,
    },
    {
      name: "Today Revenue",
      value: `₹${analytics.todayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: null,
    },
    {
      name: "This Month Revenue",
      value: `₹${analytics.monthRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      change: null,
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Analytics Dashboard</h1>
          <p className="text-secondary-600">Track your coffee shop's performance and growth</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm mt-1 ${stat.change > 0 ? "text-green-600" : "text-red-600"}`}>
                      {stat.change > 0 ? "+" : ""}
                      {stat.change}% from last period
                    </p>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Breakdown */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Revenue Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Today's Revenue</p>
                  <p className="text-sm text-secondary-600">Orders completed today</p>
                </div>
                <p className="text-xl font-bold text-green-600">₹{analytics.todayRevenue.toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">This Month's Revenue</p>
                  <p className="text-sm text-secondary-600">Orders completed this month</p>
                </div>
                <p className="text-xl font-bold text-blue-600">₹{analytics.monthRevenue.toFixed(2)}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Total Revenue</p>
                  <p className="text-sm text-secondary-600">All time revenue</p>
                </div>
                <p className="text-xl font-bold text-purple-600">₹{analytics.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Order Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Today's Orders</p>
                  <p className="text-sm text-secondary-600">Orders placed today</p>
                </div>
                <p className="text-xl font-bold text-green-600">{analytics.todayOrders}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">This Month's Orders</p>
                  <p className="text-sm text-secondary-600">Orders placed this month</p>
                </div>
                <p className="text-xl font-bold text-blue-600">{analytics.monthOrders}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900">Total Orders</p>
                  <p className="text-sm text-secondary-600">All time orders</p>
                </div>
                <p className="text-xl font-bold text-purple-600">{analytics.totalOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Average Order Value</h3>
              <p className="text-2xl font-bold text-primary-500">
                ₹{analytics.totalOrders > 0 ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : "0.00"}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Daily Average Orders</h3>
              <p className="text-2xl font-bold text-green-500">
                {analytics.monthOrders > 0 ? Math.round(analytics.monthOrders / 30) : 0}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">Monthly Growth</h3>
              <p className="text-2xl font-bold text-blue-500">
                {analytics.monthOrders > 0 ? "+" : ""}
                {Math.round((analytics.monthOrders / Math.max(analytics.totalOrders - analytics.monthOrders, 1)) * 100)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
