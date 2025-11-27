# Demo

https://github.com/user-attachments/assets/f2bcc127-d947-41f4-b8ba-b10acc465556

# DevHub - Developer Social Network

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) social network platform designed specifically for developers to connect, share knowledge, and build their professional network.

## Features

### Authentication & User Management
- User registration and login with JWT authentication
- **Google OAuth 2.0** sign-in with One Tap integration
- Protected routes and secure token management
- User profile management with avatar support

### Profile System
- Complete developer profiles with bio, skills, and social links
- Experience and education management
- Professional portfolio showcase
- Skills tagging and categorization

### Advanced Posts System
- **Rich Text Posts** with markdown support
- **Image Upload** with drag-and-drop functionality
- **Post Categories & Tags** for better organization
- **Post Analytics** with engagement metrics
- **Post Sharing** across social media platforms
- **Bookmark Posts** for reading later
- **Multiple Reactions** (Like, Love, Laugh, Wow, Sad, Angry)
- **Trending Posts** algorithm based on engagement

### Search & Discovery
- Advanced search and filtering for posts
- User search and discovery
- Category-based post filtering
- Tag-based content organization

### Notifications System
- **Real-time notifications** with Socket.IO for likes, comments, and follows
- Read/unread status management
- **Clear all notifications** functionality
- Notification preferences

### Social Features
- **User Following System** with follower counts
- **Post Comments** with threaded discussions
- **Like/Unlike** functionality
- **Social Sharing** to external platforms

### Analytics & Insights
- Post engagement analytics
- User activity tracking
- Performance insights and recommendations

## Tech Stack

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
- **Google OAuth 2.0** with google-auth-library
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Socket.IO** for real-time notifications
- **Cloudinary + Multer** for image uploads and storage
- **CORS** for cross-origin requests

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DevHub.git
   cd DevHub
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
    NODE_ENV=development
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/devhub
    JWT_SECRET=your_jwt_secret_here
    # Optional to avoid GitHub rate limits for profile repos
    GITHUB_TOKEN=your_github_personal_access_token
    # Required for image uploads
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    # Required for Google OAuth
    GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

   ```bash
    # Frontend (.env file in frontend directory)
    VITE_API_BASE_URL=http://localhost:5001
    VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
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
   - Backend API: http://localhost:5001

6. **Google OAuth Setup** (Optional but recommended)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 Client credentials
   - Add `http://localhost:5173` to Authorized JavaScript origins
   - Copy Client ID to environment variables

## 📁 Project Structure

```
devhub/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
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

## Key Features in Detail

### Advanced Posts System
- **Image Upload**: Drag-and-drop image upload with preview
- **Image-only Posts**: Post an image without text
- **Categories**: Predefined categories (Technology, Programming, Design, etc.)
- **Tags**: Custom tags for better content organization
- **Analytics**: Engagement metrics and performance insights
- **Sharing**: Share posts on Twitter, Facebook, LinkedIn, WhatsApp, Email
- **Bookmarks**: Save posts for later reading
- **Reactions**: Multiple reaction types (Like, Love, Laugh, Wow, Sad, Angry)
- **Trending**: Algorithm-based trending posts

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Consistent Palette**: App-wide color palette via CSS variables in `frontend/src/App.css`
- **Real-time Updates**: Instant feedback for user actions
- **Loading States**: Smooth loading animations
- **Error Handling**: Comprehensive error messages
- **Accessibility**: ARIA labels and keyboard navigation

### Social Features
- **Following System**: Follow/unfollow users with real-time updates
- **Notifications**: Real-time notifications for social interactions
- **Profile Analytics**: User engagement metrics
- **Social Sharing**: Share profiles and posts externally

## Deployment

### Live Application
- **Frontend**: https://dev-hub-black.vercel.app/
- **Backend**: https://devhub-30ad.onrender.com
- **Database**: MongoDB Atlas

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables

2. **Environment Variables (Vercel)**
   ```env
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

### Backend Deployment (Render)

1. **Deploy to Render**
   - Connect your GitHub repository
   - Set root directory to `/` (or leave empty)
   - Add environment variables

2. **Environment Variables (Render)**
   ```env
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://USER:PASS@CLUSTER.mongodb.net/devhub
   JWT_SECRET=your_super_secret_jwt_key
   GITHUB_TOKEN=your_github_personal_access_token
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

3. **Build Commands**
   - Build Command: `npm install`
   - Start Command: `cd backend && node server.js`

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
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/devhub
JWT_SECRET=your_super_secret_jwt_key
GITHUB_TOKEN=your_github_personal_access_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Customization

1. **Styling**: Modify `tailwind.config.js` for custom themes
2. **Categories**: Update categories in `PostForm.jsx`
3. **Reactions**: Add new reactions in `PostReactions.jsx`
4. **Analytics**: Customize analytics in `PostAnalytics.jsx`

## Troubleshooting

### Common Deployment Issues

**Frontend can't connect to backend:**
- Check `VITE_API_BASE_URL` in Vercel environment variables
- Ensure CORS is configured with production frontend URL
- Verify Render backend is running

**Google OAuth not working:**
- Add production URL to Google Cloud Console authorized origins
- Check `VITE_GOOGLE_CLIENT_ID` matches backend `GOOGLE_CLIENT_ID`
- Ensure Google script is loaded in `index.html`

**Image uploads failing:**
- Verify all Cloudinary environment variables in Render
- Check Cloudinary account limits and usage

**Database connection errors:**
- Verify MongoDB Atlas connection string
- Check IP whitelist (allow 0.0.0.0/0 for Render)
- Ensure database user has proper permissions

**Build failures on Render:**
- Check if root directory is set to `/`
- Use custom build commands if needed
- Verify all dependencies in `package.json`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database
- Express.js for the robust backend framework
- Font Awesome for the beautiful icons

## Support

If you have any questions or need help with deployment, feel free to:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ for the developer community**
