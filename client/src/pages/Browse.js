import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  User, 
  MessageCircle,
  Users,
  BookOpen,
  Clock,
  Award
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Browse = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, searchType, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/search`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      
      if (searchType === 'offered') {
        return user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchLower)
        );
      } else if (searchType === 'wanted') {
        return user.skillsWanted.some(skill => 
          skill.toLowerCase().includes(searchLower)
        );
      } else {
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.location.toLowerCase().includes(searchLower) ||
          user.skillsOffered.some(skill => 
            skill.toLowerCase().includes(searchLower)
          ) ||
          user.skillsWanted.some(skill => 
            skill.toLowerCase().includes(searchLower)
          )
        );
      }
    });
    
    setFilteredUsers(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterUsers();
  };

  const openSwapModal = (targetUser) => {
    setSelectedModal(targetUser);
  };

  const closeSwapModal = () => {
    setSelectedModal(null);
  };

  const SwapRequestModal = ({ targetUser, onClose }) => {
    const [requestData, setRequestData] = useState({
      offeredSkill: '',
      requestedSkill: '',
      message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await axios.post('/api/swap-request', {
          targetUserId: targetUser.id,
          ...requestData
        });
        
        toast.success('Swap request sent successfully!');
        onClose();
      } catch (error) {
        toast.error('Failed to send swap request');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Send Swap Request to {targetUser.name}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill you're offering
              </label>
              <select
                value={requestData.offeredSkill}
                onChange={(e) => setRequestData(prev => ({ ...prev, offeredSkill: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select a skill to offer</option>
                {user?.skillsOffered?.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill you're requesting
              </label>
              <select
                value={requestData.requestedSkill}
                onChange={(e) => setRequestData(prev => ({ ...prev, requestedSkill: e.target.value }))}
                className="input-field"
                required
              >
                <option value="">Select a skill to request</option>
                {targetUser.skillsOffered?.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (optional)
              </label>
              <textarea
                value={requestData.message}
                onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                className="input-field h-24 resize-none"
                placeholder="Add a personal message..."
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
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const UserCard = ({ user: cardUser }) => (
    <div className="card p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {cardUser.profilePhoto ? (
            <img src={cardUser.profilePhoto} alt={cardUser.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-gray-500" />
          )}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{cardUser.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{cardUser.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>
              {cardUser.rating > 0 ? `${cardUser.rating.toFixed(1)} (${cardUser.totalRatings} reviews)` : 'No ratings yet'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
          <div className="flex flex-wrap gap-1">
            {cardUser.skillsOffered?.length > 0 ? (
              cardUser.skillsOffered.map((skill, index) => (
                <span key={index} className="skill-tag bg-green-100 text-green-800">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">None listed</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Wanted</h4>
          <div className="flex flex-wrap gap-1">
            {cardUser.skillsWanted?.length > 0 ? (
              cardUser.skillsWanted.map((skill, index) => (
                <span key={index} className="skill-tag bg-blue-100 text-blue-800">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">None listed</span>
            )}
          </div>
        </div>

        {cardUser.availability?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{cardUser.availability[0]}</span>
              {cardUser.availability.length > 1 && (
                <span className="ml-1 text-gray-500">+{cardUser.availability.length - 1} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <Link
          to={`/user/${cardUser.id}`}
          className="flex-1 btn btn-secondary text-center"
        >
          View Profile
        </Link>
        <button
          onClick={() => openSwapModal(cardUser)}
          className="flex-1 btn btn-primary flex items-center justify-center"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Request Swap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Skills</h1>
          <p className="mt-2 text-gray-600">
            Discover people with skills you want to learn
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for skills, names, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="offered">Skills Offered</option>
                  <option value="wanted">Skills Wanted</option>
                </select>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Active skill swappers</span>
            </div>
          </div>
        </div>

        {/* User Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchType('all');
                setFilteredUsers(users);
              }}
              className="btn btn-primary"
            >
              Show All Users
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((cardUser) => (
              <UserCard key={cardUser.id} user={cardUser} />
            ))}
          </div>
        )}

        {/* Swap Request Modal */}
        {selectedModal && (
          <SwapRequestModal
            targetUser={selectedModal}
            onClose={closeSwapModal}
          />
        )}
      </div>
    </div>
  );
};

export default Browse;