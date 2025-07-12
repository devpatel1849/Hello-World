import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  ArrowRight, 
  Users, 
  Star, 
  Shield, 
  Search, 
  MessageCircle,
  BookOpen,
  Zap,
  Globe,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary-600" />,
      title: "Discover Skills",
      description: "Browse through thousands of skills offered by our community members and find exactly what you need to learn."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary-600" />,
      title: "Connect & Swap",
      description: "Send swap requests to skilled members and start meaningful skill exchanges that benefit both parties."
    },
    {
      icon: <Star className="h-8 w-8 text-primary-600" />,
      title: "Rate & Review",
      description: "Build trust within the community by rating and reviewing your skill swap experiences."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: "Safe & Secure",
      description: "Our platform ensures secure interactions with verified profiles and admin moderation."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Skills Shared" },
    { number: "25K+", label: "Successful Swaps" },
    { number: "4.9", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Share Skills,
                <span className="text-primary-600 block">Learn Together</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Connect with like-minded learners and exchange skills in a supportive community. 
                Teach what you know, learn what you need.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes skill sharing simple, safe, and rewarding for everyone involved.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              Start your skill sharing journey in just a few clicks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Set up your profile with the skills you can teach and what you'd like to learn.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Find & Connect
              </h3>
              <p className="text-gray-600">
                Browse skills, find the perfect match, and send swap requests to other members.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Start Learning
              </h3>
              <p className="text-gray-600">
                Begin your skill exchange sessions and grow your knowledge together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of learners who are already sharing skills and building connections.
            </p>
          </div>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-primary-600 bg-white hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Join Now - It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-white/10 transition-colors"
              >
                Already have an account?
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">SkillSwap</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting learners worldwide through skill sharing and meaningful exchanges.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;