"use client"

import { Link } from "react-router-dom"
import { Coffee, Clock, Star, ArrowRight, Users, Award, MapPin } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import coffeeBg from "../images/coffee bg.jpg"

const Home = () => {
  const { user } = useAuth()

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Coffee Enthusiast",
      content: "The best coffee in town! Their Ethiopian blend is absolutely divine. Fast delivery and always fresh.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Regular Customer",
      content: "I order from Caffio every morning. The app is so easy to use and my coffee is always ready when I arrive.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Business Owner",
      content: "Perfect for our office meetings. Great variety of drinks and snacks. Highly recommend their catering service!",
      rating: 5,
    },
  ]

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50+", label: "Coffee Varieties" },
    { number: "5★", label: "Average Rating" },
    { number: "24/7", label: "Online Ordering" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <img
          src={coffeeBg}
          alt="Coffee background"
          className="h-screen w-full object-cover absolute inset-0"
          loading="eager"
          fetchpriority="high"
          decoding="sync"
          onError={(e) => (e.target.src = '/images/fallback.jpg')}
        />
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in pt-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl text-white font-bold leading-tight">
                  Start Your Day with
                  <span className="block text-yellow-700 animate-pulse">Perfect Coffee</span>
                </h1>
                <p className="text-xl text-primary-100 max-w-lg leading-relaxed">
                  Experience the finest coffee, freshly brewed with premium beans and served with love.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {user && user.role !== "admin" ? (
                  <Link
                    to="/menu"
                    className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Coffee className="h-5 w-5 animate-bounce" />
                    <span className="animate-bounce" >Order Now</span>
                    <ArrowRight className="h-5 w-5 animate-bounce" />
                  </Link>
                ) : !user ? (
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Users className="h-5 w-5" />
                    <span>Join Now</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : null}
                <Link
                  to="/menu"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View Menu
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300">{stat.number}</div>
                    <div className="text-sm text-primary-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">Our Popular Menu</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Discover our most loved beverages and snacks, crafted with premium ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <img
                src="https://c.pxhere.com/photos/0e/7d/coffee_cappuccino_cream_caf_caffeine_cup_drink_coffee-1060714.jpg!d"
                alt="Premium Espresso"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Premium Espresso</h3>
                <p className="text-secondary-600 mb-4">Rich, bold espresso shot made from our signature blend</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-500">₹120</span>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    Hot Drinks
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <img
                src="https://d2lswn7b0fl4u2.cloudfront.net/photos/pg-salted-caramel-latte-1661428456.jpg"
                alt="Iced Latte"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Iced Caramel Latte</h3>
                <p className="text-secondary-600 mb-4">Smooth espresso with steamed milk and caramel syrup over ice</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-500">₹180</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Cold Beverages
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <img
                src="https://airfryingfoodie.com/wp-content/uploads/2022/04/Air-Fryer-chocolate-Croissants-1-500x500.jpg"
                alt="Chocolate Croissant"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Chocolate Croissant</h3>
                <p className="text-secondary-600 mb-4">Buttery, flaky croissant filled with rich dark chocolate</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-500">₹150</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Snacks</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            {(!user || user.role !== "admin") && (
              <Link
                to="/menu"
                className="btn-primary text-lg py-4 px-8 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span>View Full Menu</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">What Our Customers Say</h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-primary-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-700 font-bold text-lg">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">{testimonial.name}</h4>
                    <p className="text-sm text-secondary-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-900 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Visit Our Coffee Shop</h2>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Experience our cozy atmosphere and meet our expert baristas. We're located in the heart of the city,
                ready to serve you the perfect cup of coffee.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg">Rasulgarh, Bhubaneswar, Odisha 7510075</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg">Open Daily: 6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Award className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg">Award-winning coffee since 2020</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Coffee Shop Interior"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-secondary-900 px-6 py-4 rounded-xl font-bold shadow-lg">
                <div className="text-2xl">4.9★</div>
                <div className="text-sm">Google Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Join thousands of satisfied customers and discover your new favorite coffee blend, refreshing cold beverage,
            or delicious snack. Order now and taste the difference!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user && user.role !== "admin" ? (
              <Link
                to="/menu"
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Coffee className="h-5 w-5" />
                <span>Order Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : !user ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Users className="h-5 w-5" />
                  <span>Sign Up Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Sign In</span>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home