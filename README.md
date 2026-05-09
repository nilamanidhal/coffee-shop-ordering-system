# 🍵 Caffio - Coffee Shop Ordering System

A modern, full-stack coffee shop ordering system built with React, Node.js, Express, and MongoDB. Features real-time order tracking, admin dashboard, secure payments, and a beautiful responsive UI.

## 🚀 Features

### Customer Features
- **User Authentication**: Secure login/registration with JWT tokens
- **Interactive Menu**: Browse coffee, beverages, and snacks with images and descriptions
- **Shopping Cart**: Add/remove items, adjust quantities, persistent cart state
- **Order Management**: Place orders, track status, view order history
- **Real-time Updates**: Live order status notifications via Socket.IO
- **Secure Payments**: Integrated Razorpay payment gateway
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Admin Features
- **Admin Dashboard**: Comprehensive overview of business metrics
- **Menu Management**: Add, edit, delete menu items with image uploads
- **Order Management**: View all orders, update status, manage fulfillment
- **Analytics**: Sales reports, popular items, customer insights
- **Real-time Notifications**: Instant updates on new orders

### Technical Features
- **Real-time Communication**: Socket.IO for live order updates
- **Image Upload**: Cloudinary integration for menu item images
- **Payment Processing**: Razorpay integration for secure transactions
- **Authentication**: JWT-based auth with role-based access control
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API with proper error handling
- **Frontend**: React with modern hooks and context API
- **Styling**: Tailwind CSS with custom animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time communication
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time bidirectional communication
- **Multer** - File upload handling
- **Cloudinary** - Image hosting and management
- **Razorpay** - Payment gateway integration
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
coffee-shop-ordering-system/
├── backend/
│   ├── index.js                 # Main server file
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── MenuItem.js         # Menu item schema
│   │   ├── Order.js            # Order schema
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── menu.js             # Menu management routes
│   │   ├── orders.js           # Order management routes
│   │   ├── admin.js            # Admin routes
│   │   └── payment.js          # Payment routes
│   └── .env                    # Environment variables
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   ├── _redirects          # Netlify redirects
│   │   └── images/             # Static images
│   ├── src/
│   │   ├── main.jsx            # App entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── index.css           # Global styles
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation component
│   │   │   ├── MenuCard.jsx    # Menu item card
│   │   │   ├── CartContext.jsx # Shopping cart context
│   │   │   ├── AuthContext.jsx # Authentication context
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Menu.jsx        # Menu page
│   │   │   ├── Cart.jsx        # Shopping cart
│   │   │   ├── Orders.jsx      # Order history
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Registration page
│   │   │   ├── Payment.jsx     # Payment page
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminMenu.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminAnalytics.jsx
│   │   └── utils/
│   │       └── axiosClient.js  # API client configuration
│   └── .env                    # Frontend environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/coffee-shop-ordering-system.git
   cd coffee-shop-ordering-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

1. **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/coffeeshop
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

2. **Frontend (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/
   VITE_PROXY_TARGET=http://localhost:5000
   ```

### Running the Application

1. **Start MongoDB**
   Make sure MongoDB is running on your system or update the connection string for cloud MongoDB.

2. **Start Backend**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:5000

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   App will be available at http://localhost:5173

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add new menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/orders` - All orders
- `GET /api/admin/analytics` - Analytics data

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## 🎨 UI/UX Features

- **Modern Design**: Clean, modern interface with smooth animations
- **Responsive Layout**: Optimized for all screen sizes
- **Dark/Light Theme**: Consistent color scheme with coffee-inspired palette
- **Interactive Elements**: Hover effects, transitions, and micro-animations
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: User-friendly feedback messages
- **Form Validation**: Client-side validation with error handling

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation and sanitization
- **CORS Protection**: Configured CORS policies
- **Environment Variables**: Sensitive data stored securely
- **Role-based Access**: Admin and customer role separation

## 📱 Real-time Features

- **Order Status Updates**: Live tracking of order preparation
- **Admin Notifications**: Instant alerts for new orders
- **Socket.IO Integration**: Bidirectional real-time communication
- **Live Dashboard**: Real-time metrics and statistics

## 🚀 Deployment

### Backend Deployment
- **Recommended**: Railway, Render, or Heroku
- **Database**: MongoDB Atlas for cloud database
- **Environment**: Set production environment variables

### Frontend Deployment
- **Recommended**: Netlify or Vercel
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment**: Set production API URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/your-username)

## 🙏 Acknowledgments

- React and Vite documentation
- Tailwind CSS for styling
- Lucide React for icons
- All contributors and supporters

---

**Made with ❤️ for coffee lovers everywhere**