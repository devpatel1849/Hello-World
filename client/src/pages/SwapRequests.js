import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  MessageCircle, 
  User,
  ArrowRight,
  Trash2,
  Calendar,
  Award
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SwapRequests = () => {
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [isLoading, setIsLoading] = useState(false);
  const [ratingModal, setRatingModal] = useState(null);

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/swap-requests');
      setSwapRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch swap requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.put(`/api/swap-request/${requestId}`, { status: action });
      await fetchSwapRequests();
      toast.success(`Request ${action} successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`/api/swap-request/${requestId}`);
        await fetchSwapRequests();
        toast.success('Request deleted successfully');
      } catch (error) {
        toast.error('Failed to delete request');
      }
    }
  };

  const openRatingModal = (request) => {
    setRatingModal(request);
  };

  const closeRatingModal = () => {
    setRatingModal(null);
  };

  const RatingModal = ({ request, onClose }) => {
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const targetUserId = request.fromUserId === user.id ? request.toUserId : request.fromUserId;
        await axios.post('/api/rating', {
          targetUserId,
          rating,
          feedback,
          swapRequestId: request.id
        });
        
        toast.success('Rating submitted successfully!');
        onClose();
        fetchSwapRequests();
      } catch (error) {
        toast.error('Failed to submit rating');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rate Your Experience
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="input-field h-24 resize-none"
                placeholder="Share your experience..."
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
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const receivedRequests = swapRequests.filter(req => req.toUserId === user?.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === user?.id);

  const RequestCard = ({ request, type }) => (
    <div className="card p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {type === 'received' ? (
              request.fromUser?.profilePhoto ? (
                <img src={request.fromUser.profilePhoto} alt={request.fromUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )
            ) : (
              request.toUser?.profilePhoto ? (
                <img src={request.toUser.profilePhoto} alt={request.toUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {type === 'received' ? request.fromUser?.name : request.toUser?.name}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="ml-1 capitalize">{request.status}</span>
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm">
                <span className="text-gray-600 mr-2">Offering:</span>
                <span className="skill-tag bg-green-100 text-green-800">{request.offeredSkill}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600 mr-2">Requesting:</span>
                <span className="skill-tag bg-blue-100 text-blue-800">{request.requestedSkill}</span>
              </div>
            </div>
            
            {request.message && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-gray-700">{request.message}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        {type === 'received' && request.status === 'pending' && (
          <>
            <button
              onClick={() => handleRequestAction(request.id, 'rejected')}
              className="btn btn-secondary text-sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </button>
            <button
              onClick={() => handleRequestAction(request.id, 'accepted')}
              className="btn btn-success text-sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </button>
          </>
        )}
        
        {type === 'sent' && request.status === 'pending' && (
          <button
            onClick={() => handleDeleteRequest(request.id)}
            className="btn btn-danger text-sm"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        )}
        
        {request.status === 'accepted' && (
          <button
            onClick={() => openRatingModal(request)}
            className="btn btn-primary text-sm"
          >
            <Star className="h-4 w-4 mr-1" />
            Rate Experience
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
          <p className="mt-2 text-gray-600">
            Manage your skill swap requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Received</p>
                <p className="text-2xl font-bold text-gray-900">{receivedRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">{sentRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swapRequests.filter(req => req.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Received ({receivedRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sent'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sent ({sentRequests.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <>
                {activeTab === 'received' && (
                  <div>
                    {receivedRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No received requests yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Others will send you requests when they're interested in your skills
                        </p>
                      </div>
                    ) : (
                      <div>
                        {receivedRequests.map((request) => (
                          <RequestCard key={request.id} request={request} type="received" />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'sent' && (
                  <div>
                    {sentRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <ArrowRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No sent requests yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Browse skills to find people you'd like to swap with
                        </p>
                      </div>
                    ) : (
                      <div>
                        {sentRequests.map((request) => (
                          <RequestCard key={request.id} request={request} type="sent" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Rating Modal */}
        {ratingModal && (
          <RatingModal
            request={ratingModal}
            onClose={closeRatingModal}
          />
        )}
      </div>
    </div>
  );
};

export default SwapRequests;