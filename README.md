# DevConnector - Developer Social Network

A full-stack MERN application for developers to connect, share experiences, and showcase their skills.

## 🚀 Features

- **User Authentication** - Register/Login with JWT
- **Developer Profiles** - Create detailed profiles with skills, experience, and education
- **Social Feed** - Create posts, like and comment on others' posts
- **GitHub Integration** - Display GitHub repositories
- **Professional Network** - Connect with other developers

## 🛠️ Tech Stack

**Frontend:** React.js, Redux, Bootstrap  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT (JSON Web Tokens)  
**API Integration:** GitHub API

## 📁 Project Structure

```
MERN/
├── backend/           # Express.js API
│   ├── server.js      # Entry point
│   ├── config/        # Database configuration
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── package.json   # Backend dependencies
├── frontend/          # React.js application
│   ├── src/           # React components
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── .gitignore         # Git ignore rules
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devconnector.git
   cd devconnector
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   - Copy `backend/env.example` to `backend/.env`
   - Add your MongoDB URI, JWT secret, and GitHub token

4. **Run the application**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/auth` - Login user
- `GET /api/auth` - Get current user

### Profiles
- `GET /api/profile/me` - Get current user profile
- `POST /api/profile` - Create/update profile
- `GET /api/profile` - Get all profiles
- `PUT /api/profile/experience` - Add experience
- `PUT /api/profile/education` - Add education

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/like/:id` - Like/unlike post
- `POST /api/posts/comment/:id` - Add comment

### GitHub Integration
- `GET /api/profile/github/:username` - Get GitHub repositories

## 🔧 Scripts

```bash
npm run dev         # Run frontend and backend concurrently
npm run server      # Run backend only
npm run client      # Run frontend only
npm run build       # Build frontend for production
```

## 📝 License

This project is licensed under the MIT License.

---

Built with ❤️ by [Your Name]
