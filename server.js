const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
fs.ensureDirSync('uploads');

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Data storage (In production, use a proper database)
const DATA_FILE = 'data.json';

// Initialize data structure
const initializeData = () => {
  const defaultData = {
    users: [],
    swapRequests: [],
    ratings: [],
    adminMessages: []
  };
  
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
  
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

// Save data to file
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, location } = req.body;
    const data = initializeData();
    
    // Check if user already exists
    const existingUser = data.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      location: location || '',
      profilePhoto: null,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      rating: 0,
      totalRatings: 0
    };
    
    data.users.push(newUser);
    saveData(data);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        location: newUser.location,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = initializeData();
    
    // Find user
    const user = data.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        location: user.location,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    const data = initializeData();
    const user = data.users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, (req, res) => {
  try {
    const data = initializeData();
    const userIndex = data.users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, location, skillsOffered, skillsWanted, availability, isPublic } = req.body;
    
    data.users[userIndex] = {
      ...data.users[userIndex],
      name: name || data.users[userIndex].name,
      location: location || data.users[userIndex].location,
      skillsOffered: skillsOffered || data.users[userIndex].skillsOffered,
      skillsWanted: skillsWanted || data.users[userIndex].skillsWanted,
      availability: availability || data.users[userIndex].availability,
      isPublic: isPublic !== undefined ? isPublic : data.users[userIndex].isPublic,
      updatedAt: new Date().toISOString()
    };
    
    saveData(data);
    
    const { password, ...userProfile } = data.users[userIndex];
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload profile photo
app.post('/api/upload-photo', authenticateToken, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const data = initializeData();
    const userIndex = data.users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    data.users[userIndex].profilePhoto = req.file.filename;
    saveData(data);
    
    res.json({ 
      message: 'Photo uploaded successfully',
      photoUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Search users by skills
app.get('/api/search', authenticateToken, (req, res) => {
  try {
    const { skill, type } = req.query;
    const data = initializeData();
    
    const publicUsers = data.users.filter(u => u.isPublic && u.id !== req.user.userId);
    
    let filteredUsers = publicUsers;
    
    if (skill) {
      filteredUsers = publicUsers.filter(user => {
        if (type === 'offered') {
          return user.skillsOffered.some(s => s.toLowerCase().includes(skill.toLowerCase()));
        } else if (type === 'wanted') {
          return user.skillsWanted.some(s => s.toLowerCase().includes(skill.toLowerCase()));
        } else {
          return user.skillsOffered.some(s => s.toLowerCase().includes(skill.toLowerCase())) ||
                 user.skillsWanted.some(s => s.toLowerCase().includes(skill.toLowerCase()));
        }
      });
    }
    
    const usersWithoutPassword = filteredUsers.map(({ password, ...user }) => user);
    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create swap request
app.post('/api/swap-request', authenticateToken, (req, res) => {
  try {
    const { targetUserId, offeredSkill, requestedSkill, message } = req.body;
    const data = initializeData();
    
    const targetUser = data.users.find(u => u.id === targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }
    
    const newSwapRequest = {
      id: uuidv4(),
      fromUserId: req.user.userId,
      toUserId: targetUserId,
      offeredSkill,
      requestedSkill,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    data.swapRequests.push(newSwapRequest);
    saveData(data);
    
    res.status(201).json({
      message: 'Swap request sent successfully',
      swapRequest: newSwapRequest
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get swap requests
app.get('/api/swap-requests', authenticateToken, (req, res) => {
  try {
    const data = initializeData();
    
    const userSwapRequests = data.swapRequests.filter(sr => 
      sr.fromUserId === req.user.userId || sr.toUserId === req.user.userId
    );
    
    // Add user details to swap requests
    const enrichedRequests = userSwapRequests.map(sr => {
      const fromUser = data.users.find(u => u.id === sr.fromUserId);
      const toUser = data.users.find(u => u.id === sr.toUserId);
      
      return {
        ...sr,
        fromUser: fromUser ? { id: fromUser.id, name: fromUser.name, profilePhoto: fromUser.profilePhoto } : null,
        toUser: toUser ? { id: toUser.id, name: toUser.name, profilePhoto: toUser.profilePhoto } : null
      };
    });
    
    res.json(enrichedRequests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update swap request status
app.put('/api/swap-request/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = initializeData();
    
    const swapRequestIndex = data.swapRequests.findIndex(sr => sr.id === id);
    if (swapRequestIndex === -1) {
      return res.status(404).json({ error: 'Swap request not found' });
    }
    
    const swapRequest = data.swapRequests[swapRequestIndex];
    
    // Check if user is authorized to update this request
    if (swapRequest.toUserId !== req.user.userId && swapRequest.fromUserId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    data.swapRequests[swapRequestIndex].status = status;
    data.swapRequests[swapRequestIndex].updatedAt = new Date().toISOString();
    
    saveData(data);
    
    res.json({
      message: 'Swap request updated successfully',
      swapRequest: data.swapRequests[swapRequestIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete swap request
app.delete('/api/swap-request/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const data = initializeData();
    
    const swapRequestIndex = data.swapRequests.findIndex(sr => sr.id === id);
    if (swapRequestIndex === -1) {
      return res.status(404).json({ error: 'Swap request not found' });
    }
    
    const swapRequest = data.swapRequests[swapRequestIndex];
    
    // Check if user is authorized to delete this request
    if (swapRequest.fromUserId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    data.swapRequests.splice(swapRequestIndex, 1);
    saveData(data);
    
    res.json({ message: 'Swap request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit rating
app.post('/api/rating', authenticateToken, (req, res) => {
  try {
    const { targetUserId, rating, feedback, swapRequestId } = req.body;
    const data = initializeData();
    
    const targetUser = data.users.find(u => u.id === targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }
    
    const newRating = {
      id: uuidv4(),
      fromUserId: req.user.userId,
      toUserId: targetUserId,
      rating,
      feedback,
      swapRequestId,
      createdAt: new Date().toISOString()
    };
    
    data.ratings.push(newRating);
    
    // Update user's average rating
    const userRatings = data.ratings.filter(r => r.toUserId === targetUserId);
    const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
    
    const targetUserIndex = data.users.findIndex(u => u.id === targetUserId);
    data.users[targetUserIndex].rating = avgRating;
    data.users[targetUserIndex].totalRatings = userRatings.length;
    
    saveData(data);
    
    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user ratings
app.get('/api/ratings/:userId', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const data = initializeData();
    
    const userRatings = data.ratings.filter(r => r.toUserId === userId);
    
    // Add reviewer details
    const enrichedRatings = userRatings.map(rating => {
      const fromUser = data.users.find(u => u.id === rating.fromUserId);
      return {
        ...rating,
        fromUser: fromUser ? { id: fromUser.id, name: fromUser.name } : null
      };
    });
    
    res.json(enrichedRatings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = initializeData();
    const usersWithoutPassword = data.users.map(({ password, ...user }) => user);
    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/users/:id/ban', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;
    const data = initializeData();
    
    const userIndex = data.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    data.users[userIndex].banned = banned;
    saveData(data);
    
    res.json({ message: `User ${banned ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/swap-requests', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = initializeData();
    
    const enrichedRequests = data.swapRequests.map(sr => {
      const fromUser = data.users.find(u => u.id === sr.fromUserId);
      const toUser = data.users.find(u => u.id === sr.toUserId);
      
      return {
        ...sr,
        fromUser: fromUser ? { id: fromUser.id, name: fromUser.name, email: fromUser.email } : null,
        toUser: toUser ? { id: toUser.id, name: toUser.name, email: toUser.email } : null
      };
    });
    
    res.json(enrichedRequests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/message', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { title, message } = req.body;
    const data = initializeData();
    
    const newMessage = {
      id: uuidv4(),
      title,
      message,
      createdAt: new Date().toISOString(),
      fromAdmin: req.user.userId
    };
    
    data.adminMessages.push(newMessage);
    saveData(data);
    
    res.status(201).json({
      message: 'Admin message sent successfully',
      adminMessage: newMessage
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/reports', authenticateToken, requireAdmin, (req, res) => {
  try {
    const data = initializeData();
    
    const reports = {
      totalUsers: data.users.length,
      totalSwapRequests: data.swapRequests.length,
      pendingRequests: data.swapRequests.filter(sr => sr.status === 'pending').length,
      acceptedRequests: data.swapRequests.filter(sr => sr.status === 'accepted').length,
      rejectedRequests: data.swapRequests.filter(sr => sr.status === 'rejected').length,
      totalRatings: data.ratings.length,
      averageRating: data.ratings.length > 0 ? data.ratings.reduce((sum, r) => sum + r.rating, 0) / data.ratings.length : 0
    };
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get admin messages
app.get('/api/admin-messages', authenticateToken, (req, res) => {
  try {
    const data = initializeData();
    res.json(data.adminMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files from React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});