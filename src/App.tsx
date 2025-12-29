import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Seeker/Dashboard';
import Profile from './pages/Seeker/Profile';
import JobSearch from './pages/Jobs/JobSearch';
import JobDetail from './pages/Jobs/JobDetail';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import PostJob from './pages/Employer/PostJob';
import Applicants from './pages/Employer/Applicants';

type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'profile'
  | 'jobs'
  | 'job-detail'
  | 'employer-dashboard'
  | 'post-job'
  | 'applicants';

interface PageData {
  jobId?: string;
}

/* ---------------- URL ↔ PAGE MAP ---------------- */
const pathToPage: Record<string, Page> = {
  '/': 'landing',
  '/login': 'login',
  '/signup': 'signup',
  '/dashboard': 'dashboard',
  '/profile': 'profile',
  '/jobs': 'jobs',
  '/employer': 'employer-dashboard',
  '/post-job': 'post-job',
};

const pageToPath: Record<Page, string> = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  profile: '/profile',
  jobs: '/jobs',
  'job-detail': '/jobs',
  'employer-dashboard': '/employer',
  'post-job': '/post-job',
  applicants: '/employer',
};

function App() {
  const { loading: authLoading, user, role } = useAuth();

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return pathToPage[window.location.pathname] || 'landing';
  });
  const [pageData, setPageData] = useState<PageData>({});

  /* -------- NAVIGATION (UI SAFE) -------- */
  const handleNavigate = (page: Page, data?: PageData) => {
    setCurrentPage(page);
    setPageData(data || {});
    window.history.pushState({}, '', pageToPath[page]);
    window.scrollTo(0, 0);
  };

  /* -------- HANDLE BACK / REFRESH -------- */
  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(pathToPage[window.location.pathname] || 'landing');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /* -------- AUTO LOGIN REDIRECT -------- */
  useEffect(() => {
    if (!authLoading && user) {
      if (role === 'employer') {
        handleNavigate('employer-dashboard');
      } else {
        handleNavigate('dashboard');
      }
    }
  }, [authLoading, user, role]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'signup':
        return <Signup onNavigate={handleNavigate} />;
      case 'dashboard':
        return role === 'employer'
          ? <EmployerDashboard onNavigate={handleNavigate} />
          : <Dashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobSearch onNavigate={handleNavigate} />;
      case 'job-detail':
        return <JobDetail jobId={pageData.jobId!} onNavigate={handleNavigate} />;
      case 'post-job':
        return <PostJob onNavigate={handleNavigate} />;
      case 'applicants':
        return <Applicants jobId={pageData.jobId!} onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  const hideHeaderFooter = currentPage === 'login' || currentPage === 'signup';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && (
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      <main className="flex-grow">
        {renderPage()}
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
