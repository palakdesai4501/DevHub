# 🚀 DevConnector - Developer Social Network

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) social network platform designed specifically for developers to connect, share knowledge, and build their professional network.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT authentication
- Protected routes and secure token management
- User profile management with avatar support

### 👤 Profile System
- Complete developer profiles with bio, skills, and social links
- Experience and education management
- Professional portfolio showcase
- Skills tagging and categorization

### 📝 Advanced Posts System
- **Rich Text Posts** with markdown support
- **Image Upload** with drag-and-drop functionality
- **Post Categories & Tags** for better organization
- **Post Analytics** with engagement metrics
- **Post Sharing** across social media platforms
- **Bookmark Posts** for reading later
- **Multiple Reactions** (Like, Love, Laugh, Wow, Sad, Angry)
- **Trending Posts** algorithm based on engagement

### 🔍 Search & Discovery
- Advanced search and filtering for posts
- User search and discovery
- Category-based post filtering
- Tag-based content organization

### 🔔 Notifications System
- Real-time notifications for likes, comments, and follows
- Read/unread status management
- Notification preferences

### 👥 Social Features
- **User Following System** with follower counts
- **Post Comments** with threaded discussions
- **Like/Unlike** functionality
- **Social Sharing** to external platforms

### 📊 Analytics & Insights
- Post engagement analytics
- User activity tracking
- Performance insights and recommendations

## 🛠️ Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Font Awesome** for icons
- **Context API** for state management
- **Vite** for fast development and building

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devconnector.git
   cd devconnector
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env file in backend directory)
   MONGO_URI=mongodb://localhost:27017/devconnector
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   npm start

   # Start frontend (from frontend directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
devconnector/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── profile.js
│   │   └── posts.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── posts/
│   │   │   ├── profile/
│   │   │   ├── profiles/
│   │   │   ├── notifications/
│   │   │   └── routing/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ProfileContext.jsx
│   │   │   └── PostsContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── index.html
└── README.md
```

## 🌟 Key Features in Detail

### Advanced Posts System
- **Image Upload**: Drag-and-drop image upload with preview
- **Categories**: Predefined categories (Technology, Programming, Design, etc.)
- **Tags**: Custom tags for better content organization
- **Analytics**: Engagement metrics and performance insights
- **Sharing**: Share posts on Twitter, Facebook, LinkedIn, WhatsApp, Email
- **Bookmarks**: Save posts for later reading
- **Reactions**: Multiple reaction types (Like, Love, Laugh, Wow, Sad, Angry)
- **Trending**: Algorithm-based trending posts

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Instant feedback for user actions
- **Loading States**: Smooth loading animations
- **Error Handling**: Comprehensive error messages
- **Accessibility**: ARIA labels and keyboard navigation

### Social Features
- **Following System**: Follow/unfollow users with real-time updates
- **Notifications**: Real-time notifications for social interactions
- **Profile Analytics**: User engagement metrics
- **Social Sharing**: Share profiles and posts externally

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Environment Variables**
   - `VITE_API_URL`: Your backend API URL

### Backend Deployment (Heroku/Railway)

1. **Prepare for deployment**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `PORT`: Port number (auto-assigned by platform)

3. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Database Setup

1. **MongoDB Atlas** (Recommended for production)
   - Create a free cluster
   - Get connection string
   - Add to environment variables

2. **Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Use local connection string

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGO_URI=mongodb://localhost:27017/devconnector
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### Customization

1. **Styling**: Modify `tailwind.config.js` for custom themes
2. **Categories**: Update categories in `PostForm.jsx`
3. **Reactions**: Add new reactions in `PostReactions.jsx`
4. **Analytics**: Customize analytics in `PostAnalytics.jsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database
- Express.js for the robust backend framework
- Font Awesome for the beautiful icons

## 📞 Support

If you have any questions or need help with deployment, feel free to:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ for the developer community**
