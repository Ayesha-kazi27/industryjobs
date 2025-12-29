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

/* ---------------- ROUTE MAP ---------------- */
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
  const { loading, user, role } = useAuth();

  const [currentPage, setCurrentPage] = useState<Page>(
    pathToPage[window.location.pathname] || 'landing'
  );
  const [pageData, setPageData] = useState<PageData>({});

  /* ---------------- AUTH GUARD ---------------- */
  const requireAuth = (page: Page): Page => {
    if (!user && page !== 'login' && page !== 'signup' && page !== 'landing') {
      return 'login';
    }

    if (page.startsWith('employer') || page === 'post-job' || page === 'applicants') {
      return role === 'employer' ? page : 'dashboard';
    }

    return page;
  };

  /* ---------------- NAVIGATION ---------------- */
  const handleNavigate = (page: Page, data?: PageData) => {
    const safePage = requireAuth(page);
    setCurrentPage(safePage);
    setPageData(data || {});
    window.history.pushState({}, '', pageToPath[safePage]);
    window.scrollTo(0, 0);
  };

  /* ---------------- BACK / REFRESH ---------------- */
  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(pathToPage[window.location.pathname] || 'landing');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
        return <Dashboard onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobSearch onNavigate={handleNavigate} />;
      case 'job-detail':
        return <JobDetail jobId={pageData.jobId!} onNavigate={handleNavigate} />;
      case 'employer-dashboard':
        return <EmployerDashboard onNavigate={handleNavigate} />;
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

      <main className="flex-grow">{renderPage()}</main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
