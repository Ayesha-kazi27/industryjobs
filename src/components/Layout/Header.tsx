import { useState } from 'react';
import { Menu, X, Briefcase, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">IndustryJobs</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Jobs
                </button>
                <button
                  onClick={() => onNavigate(role === 'seeker' ? 'dashboard' : 'employer-dashboard')}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('notifications')}
                  className="relative text-gray-700 hover:text-blue-600 transition"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  <User className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {!user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('jobs');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('jobs');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
                >
                  Jobs
                </button>
                <button
                  onClick={() => {
                    onNavigate(role === 'seeker' ? 'dashboard' : 'employer-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-red-600 hover:text-red-700 transition"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
