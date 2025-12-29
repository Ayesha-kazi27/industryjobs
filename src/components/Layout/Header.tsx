import { useState } from 'react';
import { Menu, X, Briefcase, Bell, User, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  const isSeeker = role === 'seeker';
  const isEmployer = role === 'employer';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate(user ? (isEmployer ? 'employer-dashboard' : 'dashboard') : 'landing')}
          >
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              IndustryJobs
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <button onClick={() => onNavigate('jobs')} className="text-gray-700 hover:text-blue-600">
                  Find Jobs
                </button>
                <button onClick={() => onNavigate('login')} className="text-gray-700 hover:text-blue-600">
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Get Started
                </button>
              </>
            )}

            {user && isSeeker && (
              <>
                <button onClick={() => onNavigate('jobs')} className="text-gray-700 hover:text-blue-600">
                  Jobs
                </button>
                <button onClick={() => onNavigate('dashboard')} className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </button>
                <button onClick={() => onNavigate('profile')} className="text-gray-700 hover:text-blue-600">
                  <User className="h-5 w-5" />
                </button>
                <button onClick={handleSignOut} className="text-gray-700 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}

            {user && isEmployer && (
              <>
                <button onClick={() => onNavigate('employer-dashboard')} className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </button>
                <button onClick={() => onNavigate('post-job')} className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                  <PlusCircle className="h-4 w-4" />
                  Post Job
                </button>
                <button onClick={handleSignOut} className="text-gray-700 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {!user && (
              <>
                <button onClick={() => onNavigate('jobs')} className="block w-full text-left">
                  Find Jobs
                </button>
                <button onClick={() => onNavigate('login')} className="block w-full text-left">
                  Sign In
                </button>
                <button onClick={() => onNavigate('signup')} className="block w-full bg-blue-600 text-white px-4 py-2 rounded">
                  Get Started
                </button>
              </>
            )}

            {user && isSeeker && (
              <>
                <button onClick={() => onNavigate('jobs')} className="block w-full text-left">
                  Jobs
                </button>
                <button onClick={() => onNavigate('dashboard')} className="block w-full text-left">
                  Dashboard
                </button>
                <button onClick={() => onNavigate('profile')} className="block w-full text-left">
                  Profile
                </button>
                <button onClick={handleSignOut} className="block w-full text-left text-red-600">
                  Sign Out
                </button>
              </>
            )}

            {user && isEmployer && (
              <>
                <button onClick={() => onNavigate('employer-dashboard')} className="block w-full text-left">
                  Dashboard
                </button>
                <button onClick={() => onNavigate('post-job')} className="block w-full text-left">
                  Post Job
                </button>
                <button onClick={handleSignOut} className="block w-full text-left text-red-600">
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
