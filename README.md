# Skill Swap Platform

A modern, full-stack web application that enables users to exchange skills with each other in a supportive community environment.

## Features

### 🎯 User Features
- **User Authentication**: Secure registration and login system
- **Profile Management**: Complete profile customization with skills, availability, and photos
- **Skill Discovery**: Browse and search for users by skills offered or wanted
- **Swap Requests**: Send and receive skill exchange requests
- **Rating System**: Rate and review skill exchange experiences
- **Privacy Controls**: Make your profile public or private
- **Real-time Notifications**: Stay updated on swap requests and platform messages

### 🛡️ Admin Features
- **User Management**: View, ban, and unban users
- **Request Monitoring**: Monitor all swap requests and their status
- **Platform Messaging**: Send announcements to all users
- **Analytics Dashboard**: View detailed platform statistics and reports
- **Content Moderation**: Manage inappropriate content and users

### 💻 Technical Features
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **RESTful API**: Comprehensive backend API with Express.js
- **File Upload**: Profile photo upload functionality
- **Data Persistence**: JSON-based data storage (easily upgradeable to database)
- **Authentication**: JWT-based secure authentication
- **Form Validation**: Client and server-side validation

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and context
- **React Router**: Client-side routing
- **Tailwind CSS**: Modern utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Elegant notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **UUID**: Unique identifier generation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skill-swap-platform
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### 4. Start the Application
```bash
# Start both backend and frontend (recommended)
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only
npm run client
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Usage

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Complete your profile** by adding skills you offer and want to learn
3. **Set your availability** to let others know when you're free
4. **Browse other users** to find interesting skill exchanges
5. **Send swap requests** to users whose skills match your interests
6. **Accept or reject** incoming requests
7. **Rate your experience** after completing a skill swap

### Admin Access
To access admin features:
1. Register a regular account
2. Manually set `isAdmin: true` in the `data.json` file for your user
3. Restart the application
4. Access the admin dashboard at `/admin`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/upload-photo` - Upload profile photo

### Skill Discovery
- `GET /api/search` - Search users by skills
- `GET /api/user/:id` - Get specific user profile

### Swap Requests
- `POST /api/swap-request` - Create swap request
- `GET /api/swap-requests` - Get user's swap requests
- `PUT /api/swap-request/:id` - Update swap request status
- `DELETE /api/swap-request/:id` - Delete swap request

### Ratings
- `POST /api/rating` - Submit rating
- `GET /api/ratings/:userId` - Get user ratings

### Admin (Protected)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `GET /api/admin/swap-requests` - Get all swap requests
- `POST /api/admin/message` - Send platform message
- `GET /api/admin/reports` - Get platform statistics

## File Structure

```
skill-swap-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── uploads/                # User uploaded files
├── server.js               # Express backend
├── data.json              # Data storage (auto-generated)
├── package.json
└── README.md
```

## Features Overview

### User Dashboard
- Personal statistics and activity overview
- Quick access to main features
- Recent swap requests and admin messages

### Profile Management
- Tabbed interface for easy navigation
- Skills management with tags
- Availability scheduling
- Privacy controls
- Photo upload with preview

### Skill Discovery
- Advanced search and filtering
- User cards with detailed information
- Direct swap request functionality
- User ratings and reviews

### Swap Management
- Separate views for sent and received requests
- Request status tracking
- Built-in messaging system
- Rating and feedback system

### Admin Dashboard
- Real-time platform statistics
- User management with ban/unban functionality
- Swap request monitoring
- Platform-wide messaging
- Comprehensive reporting

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes and API endpoints
- Input validation and sanitization
- File upload restrictions
- Admin role protection

## Deployment

### Production Build
```bash
# Build the frontend
npm run build

# Start in production mode
NODE_ENV=production npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-very-secure-production-jwt-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.

---

**Happy Skill Swapping!** 🎉