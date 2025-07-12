import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { 
  Camera, 
  Plus, 
  X, 
  Save, 
  User, 
  Mail, 
  MapPin, 
  Clock, 
  Eye, 
  EyeOff,
  Star,
  Edit3
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: true
  });
  const [newSkill, setNewSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');
  const [newAvailability, setNewAvailability] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || [],
        isPublic: user.isPublic !== undefined ? user.isPublic : true
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;

    const formDataPhoto = new FormData();
    formDataPhoto.append('photo', photoFile);

    try {
      const response = await axios.post('/api/upload-photo', formDataPhoto, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      updateUser({ profilePhoto: response.data.photoUrl });
      toast.success('Photo uploaded successfully!');
      setPhotoFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error('Failed to upload photo');
    }
  };

  const addSkill = (type) => {
    const skill = type === 'offered' ? newSkill : newWantedSkill;
    if (skill.trim()) {
      setFormData(prev => ({
        ...prev,
        [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: [
          ...prev[type === 'offered' ? 'skillsOffered' : 'skillsWanted'],
          skill.trim()
        ]
      }));
      
      if (type === 'offered') {
        setNewSkill('');
      } else {
        setNewWantedSkill('');
      }
    }
  };

  const removeSkill = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: prev[type === 'offered' ? 'skillsOffered' : 'skillsWanted'].filter((_, i) => i !== index)
    }));
  };

  const addAvailability = () => {
    if (newAvailability.trim()) {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, newAvailability.trim()]
      }));
      setNewAvailability('');
    }
  };

  const removeAvailability = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put('/api/profile', formData);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
      
      // Upload photo if there's one
      if (photoFile) {
        await uploadPhoto();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: <User className="h-4 w-4" /> },
    { id: 'skills', label: 'Skills', icon: <Star className="h-4 w-4" /> },
    { id: 'availability', label: 'Availability', icon: <Clock className="h-4 w-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile information and preferences
          </p>
        </div>

        {/* Profile Photo Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-500" />
                )}
              </div>
              <button
                onClick={() => document.getElementById('photo-upload').click()}
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload a photo to help others recognize you
              </p>
              {photoFile && (
                <button
                  onClick={uploadPhoto}
                  className="mt-2 btn btn-primary text-sm"
                >
                  Save Photo
                </button>
              )}
            </div>
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

          <form onSubmit={handleSubmit} className="p-6">
            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your email"
                      required
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your city/location"
                  />
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* Skills Offered */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills You Offer</h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill you can teach"
                      className="flex-1 input-field"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('offered'))}
                    />
                    <button
                      type="button"
                      onClick={() => addSkill('offered')}
                      className="btn btn-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsOffered.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill('offered', index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills You Want to Learn</h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newWantedSkill}
                      onChange={(e) => setNewWantedSkill(e.target.value)}
                      placeholder="Add a skill you want to learn"
                      className="flex-1 input-field"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('wanted'))}
                    />
                    <button
                      type="button"
                      onClick={() => addSkill('wanted')}
                      className="btn btn-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsWanted.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill('wanted', index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">When Are You Available?</h3>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newAvailability}
                      onChange={(e) => setNewAvailability(e.target.value)}
                      placeholder="e.g., Weekends, Evenings, Monday-Friday 6-8 PM"
                      className="flex-1 input-field"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAvailability())}
                    />
                    <button
                      type="button"
                      onClick={addAvailability}
                      className="btn btn-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.availability.map((time, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-900">{time}</span>
                        <button
                          type="button"
                          onClick={() => removeAvailability(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Public Profile</h4>
                        <p className="text-sm text-gray-600">
                          Allow others to find and contact you for skill swaps
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> When your profile is private, others won't be able to find you through search, but you can still browse and contact others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex items-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;