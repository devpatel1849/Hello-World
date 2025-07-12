import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  User, 
  MapPin, 
  Star, 
  Clock, 
  MessageCircle, 
  Calendar,
  Award,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserRatings();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/search?userId=${userId}`);
      const user = response.data.find(u => u.id === userId);
      setUserProfile(user);
    } catch (error) {
      toast.error('Failed to fetch user profile');
      navigate('/browse');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await axios.get(`/api/ratings/${userId}`);
      setRatings(response.data);
    } catch (error) {
      console.error('Failed to fetch ratings');
    }
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
                {currentUser?.skillsOffered?.map((skill, index) => (
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or isn't public.</p>
          <button
            onClick={() => navigate('/browse')}
            className="btn btn-primary"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {userProfile.profilePhoto ? (
                  <img src={userProfile.profilePhoto} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-500" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{userProfile.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>
                    {userProfile.rating > 0 
                      ? `${userProfile.rating.toFixed(1)} (${userProfile.totalRatings} reviews)`
                      : 'No ratings yet'
                    }
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Member since {new Date(userProfile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {currentUser?.id !== userProfile.id && (
              <button
                onClick={() => setShowSwapModal(true)}
                className="btn btn-primary flex items-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Request Swap
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Offered */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Offered</h2>
              {userProfile.skillsOffered?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userProfile.skillsOffered.map((skill, index) => (
                    <span key={index} className="skill-tag bg-green-100 text-green-800">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills offered yet</p>
              )}
            </div>

            {/* Skills Wanted */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Wanted</h2>
              {userProfile.skillsWanted?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userProfile.skillsWanted.map((skill, index) => (
                    <span key={index} className="skill-tag bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills wanted yet</p>
              )}
            </div>

            {/* Availability */}
            {userProfile.availability?.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
                <div className="space-y-2">
                  {userProfile.availability.map((time, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Offered</span>
                  <span className="font-semibold">{userProfile.skillsOffered?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Wanted</span>
                  <span className="font-semibold">{userProfile.skillsWanted?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Ratings</span>
                  <span className="font-semibold">{userProfile.totalRatings || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">
                    {userProfile.rating > 0 ? userProfile.rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
              {ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.slice(0, 3).map((rating) => (
                    <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{rating.fromUser?.name}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {rating.feedback && (
                        <p className="text-sm text-gray-600">{rating.feedback}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {ratings.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{ratings.length - 3} more reviews
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Swap Request Modal */}
        {showSwapModal && (
          <SwapRequestModal
            targetUser={userProfile}
            onClose={() => setShowSwapModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;