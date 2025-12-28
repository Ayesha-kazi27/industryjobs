import { Search, Factory, Wrench, Zap, HardHat, Droplet, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface LandingProps {
  onNavigate: (page: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onNavigate('jobs');
  };

  const categories = [
    { icon: Factory, name: 'Manufacturing', count: '1,245 jobs', color: 'bg-blue-100 text-blue-600' },
    { icon: Wrench, name: 'Mechanical', count: '892 jobs', color: 'bg-orange-100 text-orange-600' },
    { icon: Zap, name: 'Electrical', count: '756 jobs', color: 'bg-yellow-100 text-yellow-600' },
    { icon: HardHat, name: 'Civil', count: '634 jobs', color: 'bg-green-100 text-green-600' },
    { icon: Droplet, name: 'Oil & Gas', count: '523 jobs', color: 'bg-red-100 text-red-600' },
    { icon: Users, name: 'Supervisors', count: '412 jobs', color: 'bg-slate-100 text-slate-600' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Job Matching',
      description: 'AI-powered algorithm matches your skills with the perfect industrial job opportunities.',
    },
    {
      icon: Shield,
      title: 'Verified Employers',
      description: 'All companies are verified to ensure safe and legitimate job opportunities.',
    },
    {
      icon: CheckCircle,
      title: 'Easy Application',
      description: 'Apply to multiple jobs with one click using your saved profile and resume.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Your Profile',
      description: 'Sign up and build your professional profile with skills, experience, and certifications.',
    },
    {
      number: '2',
      title: 'Search & Apply',
      description: 'Browse thousands of industrial jobs and apply with one click.',
    },
    {
      number: '3',
      title: 'Get Hired',
      description: 'Connect with top employers and land your dream industrial job.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find the Right Industrial Job Faster
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with top employers in manufacturing, mechanical, electrical, and more industrial sectors
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Job title, keywords, or company"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>
                <div className="md:col-span-4">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, state, or ZIP code"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    onClick={handleSearch}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition shadow-lg"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-gray-600 text-sm">Popular:</span>
                {['Welder', 'Electrician', 'Forklift Operator', 'Quality Control'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Industry
            </h2>
            <p className="text-lg text-gray-600">
              Explore opportunities across various industrial sectors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onNavigate('jobs')}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition group"
              >
                <div className={`${category.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <category.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose IndustryJobs?
            </h2>
            <p className="text-lg text-gray-600">
              The most trusted platform for industrial job seekers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white p-8 rounded-xl shadow-md h-full">
                  <div className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-blue-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of industrial workers who found their perfect job through IndustryJobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('signup')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Create Free Account
            </button>
            <button
              onClick={() => onNavigate('jobs')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
