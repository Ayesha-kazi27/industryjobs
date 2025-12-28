import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Public pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Seeker pages
import Dashboard from './pages/Seeker/Dashboard';
import Profile from './pages/Seeker/Profile';

// Job pages
import JobSearch from './pages/Jobs/JobSearch';
import JobDetail from './pages/Jobs/JobDetail';

// Employer pages
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

function App() {
  const { loading: authLoading, user, role } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [pageData, setPageData] = useState<PageData>({});

  const handleNavigate = (page: Page, data?: PageData) => {
    setCurrentPage(page);
    setPageData(data || {});
    window.scrollTo(0, 0);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
