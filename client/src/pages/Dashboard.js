import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  Plus, 
  Users, 
  Star, 
  Clock, 
  TrendingUp, 
  MessageSquare,
  Search,
  ArrowRight,
  BookOpen,
  Award,
  Activity
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSwaps: 0,
    pendingRequests: 0,
    completedSwaps: 0,
    rating: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminMessages, setAdminMessages] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [swapRequestsResponse, adminMessagesResponse] = await Promise.all([
        axios.get('/api/swap-requests'),
        axios.get('/api/admin-messages')
      ]);

      const swapRequests = swapRequestsResponse.data;
      const adminMsgs = adminMessagesResponse.data;

      setRecentRequests(swapRequests.slice(0, 5));
      setAdminMessages(adminMsgs.slice(0, 3));
      
      // Calculate stats
      const pendingRequests = swapRequests.filter(req => req.status === 'pending').length;
      const completedSwaps = swapRequests.filter(req => req.status === 'accepted').length;
      
      setStats({
        totalSwaps: swapRequests.length,
        pendingRequests,
        completedSwaps,
        rating: user?.rating || 0
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
    {
      title: 'Browse Skills',
      description: 'Find people with skills you want to learn',
      icon: <Search className="h-6 w-6" />,
      link: '/browse',
      color: 'bg-blue-500'
    },
    {
      title: 'Update Profile',
      description: 'Add or update your skills and availability',
      icon: <Users className="h-6 w-6" />,
      link: '/profile',
      color: 'bg-green-500'
    },
    {
      title: 'View Requests',
      description: 'Check your incoming and outgoing requests',
      icon: <MessageSquare className="h-6 w-6" />,
      link: '/swap-requests',
      color: 'bg-purple-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your skill swaps
          </p>
        </div>

        {/* Admin Messages */}
        {adminMessages.length > 0 && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                📢 Platform Updates
              </h3>
              <div className="space-y-2">
                {adminMessages.map((message) => (
                  <div key={message.id} className="text-blue-800">
                    <div className="font-medium">{message.title}</div>
                    <div className="text-sm text-blue-600">{message.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSwaps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rating > 0 ? stats.rating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                      {action.icon}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Swap Requests
                </h2>
                <Link
                  to="/swap-requests"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              {recentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No swap requests yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start by browsing skills or updating your profile
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {request.fromUserId === user?.id ? 'To' : 'From'}: {' '}
                            {request.fromUserId === user?.id 
                              ? request.toUser?.name 
                              : request.fromUser?.name
                            }
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Offering: {request.offeredSkill} → Requesting: {request.requestedSkill}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Profile Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Skills Offered</p>
                  <p className="text-gray-900">
                    {user?.skillsOffered?.length > 0 
                      ? `${user.skillsOffered.length} skills`
                      : 'None yet'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Skills Wanted</p>
                  <p className="text-gray-900">
                    {user?.skillsWanted?.length > 0 
                      ? `${user.skillsWanted.length} skills`
                      : 'None yet'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Status</p>
                  <p className="text-gray-900">
                    {user?.isPublic ? (
                      <span className="text-green-600">Public</span>
                    ) : (
                      <span className="text-red-600">Private</span>
                    )}
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="mt-4 w-full btn btn-primary flex items-center justify-center"
              >
                Update Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Add specific skills to get more relevant matches</li>
                <li>• Keep your profile public for better visibility</li>
                <li>• Rate your swap partners to build trust</li>
                <li>• Be clear about your availability times</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;