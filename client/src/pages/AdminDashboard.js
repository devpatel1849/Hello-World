import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Send,
  Calendar,
  TrendingUp,
  Activity,
  Star,
  Clock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [reports, setReports] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, swapReqRes, reportsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/swap-requests'),
        axios.get('/api/admin/reports')
      ]);

      setUsers(usersRes.data);
      setSwapRequests(swapReqRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId, banned) => {
    try {
      await axios.put(`/api/admin/users/${userId}/ban`, { banned });
      await fetchAdminData();
      toast.success(`User ${banned ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${banned ? 'ban' : 'unban'} user`);
    }
  };

  const MessageModal = ({ onClose }) => {
    const [messageData, setMessageData] = useState({
      title: '',
      message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await axios.post('/api/admin/message', messageData);
        toast.success('Message sent successfully!');
        onClose();
      } catch (error) {
        toast.error('Failed to send message');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Send Platform Message
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={messageData.title}
                onChange={(e) => setMessageData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
                placeholder="Message title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={messageData.message}
                onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                className="input-field h-24 resize-none"
                placeholder="Type your message..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { id: 'swaps', label: 'Swap Requests', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'reports', label: 'Reports', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 mr-3 text-primary-600" />
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Platform management and monitoring
              </p>
            </div>
            <button
              onClick={() => setMessageModal(true)}
              className="btn btn-primary flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Users</p>
                        <p className="text-2xl font-bold">{reports.totalUsers || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Total Swaps</p>
                        <p className="text-2xl font-bold">{reports.totalSwapRequests || 0}</p>
                      </div>
                      <Activity className="h-8 w-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100">Pending Requests</p>
                        <p className="text-2xl font-bold">{reports.pendingRequests || 0}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Avg Rating</p>
                        <p className="text-2xl font-bold">{reports.averageRating?.toFixed(1) || 'N/A'}</p>
                      </div>
                      <Star className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {swapRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-900">
                            {request.fromUser?.name} → {request.toUser?.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <span className="text-sm text-gray-600">{users.length} total users</span>
                </div>
                
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Skills
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className={user.banned ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.skillsOffered?.length || 0} offered, {user.skillsWanted?.length || 0} wanted
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {user.rating > 0 ? user.rating.toFixed(1) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.banned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleBanUser(user.id, !user.banned)}
                              className={`${
                                user.banned ? 'btn btn-success' : 'btn btn-danger'
                              } text-xs`}
                            >
                              {user.banned ? 'Unban' : 'Ban'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Swap Requests Tab */}
            {activeTab === 'swaps' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Swap Requests</h3>
                  <span className="text-sm text-gray-600">{swapRequests.length} total requests</span>
                </div>
                
                <div className="space-y-4">
                  {swapRequests.map((request) => (
                    <div key={request.id} className="card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900">
                                {request.fromUser?.name} → {request.toUser?.name}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Offering:</span> {request.offeredSkill} → 
                            <span className="font-medium ml-2">Requesting:</span> {request.requestedSkill}
                          </div>
                          {request.message && (
                            <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                              {request.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Reports</h3>
                  <button className="btn btn-primary flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Requests</span>
                        <span className="font-semibold">{reports.totalSwapRequests || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-semibold text-yellow-600">{reports.pendingRequests || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accepted</span>
                        <span className="font-semibold text-green-600">{reports.acceptedRequests || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rejected</span>
                        <span className="font-semibold text-red-600">{reports.rejectedRequests || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Users</span>
                        <span className="font-semibold">{reports.totalUsers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Ratings</span>
                        <span className="font-semibold">{reports.totalRatings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Rating</span>
                        <span className="font-semibold">{reports.averageRating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="font-semibold">
                          {reports.totalSwapRequests > 0 
                            ? `${((reports.acceptedRequests / reports.totalSwapRequests) * 100).toFixed(1)}%`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Modal */}
        {messageModal && (
          <MessageModal onClose={() => setMessageModal(false)} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;