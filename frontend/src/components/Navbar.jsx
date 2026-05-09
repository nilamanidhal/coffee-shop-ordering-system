"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import logo from "../images/coffee-bean.png"
import { Coffee, ShoppingCart, User, Menu, X, LogOut, Settings, Package } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsUserMenuOpen(false)
  }

  // Update the handleDashboardNavigation function
  const handleDashboardNavigation = () => {
    if (user?.role === "admin") {
      navigate("/admin")
    } else {
      navigate("/dashboard") // Navigate to user dashboard instead of orders
    }
    setIsUserMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const cartItemsCount = getCartItemsCount()

  return (
    <nav className="bg-[#4d2e1c]/40 backdrop-blur-md border-b border-white/20 text-white sticky w-full top-0 left-0 z-50 shadow-lg transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <Coffee className="h-8 w-8 text-primary-500" />
             */}
            <img src={logo} alt="logo" className="flex items-center space-x-2 h-12"/>
            <span className="text-xl font-bold text-white animate-bounce">Caffio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive("/") ? "text-primary-500" : "text-secondary-900 hover:text-primary-500"
              }`}
            >
              Home
            </Link>
            {(!user || user.role !== "admin") && (
              <Link
                to="/menu"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive("/menu") ? "text-primary-500" : "text-secondary-900 hover:text-primary-500"
                }`}
              >
                Menu
              </Link>
            )}
            {user && user.role !== "admin" && (
              <Link
                to="/orders"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive("/orders") ? "text-primary-500" : "text-secondary-900 hover:text-primary-500"
                }`}
              >
                My Orders
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith("/admin")
                    ? "text-primary-500"
                    : "text-secondary-900 hover:text-primary-500"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {user && (
              <Link
                to="/cart"
                className="relative p-2 text-secondary-500 hover:text-primary-500 transition-colors duration-200"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                >
                  <User className="h-6 w-6 text-secondary-600" />
                  <span className="hidden md:block text-sm font-medium text-secondary-900">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                      <p className="text-xs text-secondary-500">{user.email}</p>
                      <p className="text-xs text-primary-500 font-medium capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={handleDashboardNavigation}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                    </button>
                    {user.role === "admin" && (
                      <Link
                        to="/admin/orders"
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Manage Orders
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-secondary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-primary-500 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-sm font-medium ${isActive("/") ? "text-primary-500" : "text-secondary-600"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {(!user || user.role !== "admin") && (
                <Link
                  to="/menu"
                  className={`text-sm font-medium ${isActive("/menu") ? "text-primary-500" : "text-secondary-600"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Menu
                </Link>
              )}
              {user && user.role !== "admin" && (
                <Link
                  to="/orders"
                  className={`text-sm font-medium ${isActive("/orders") ? "text-primary-500" : "text-secondary-600"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium ${
                    location.pathname.startsWith("/admin") ? "text-primary-500" : "text-secondary-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-secondary-100">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-secondary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm w-fit" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
