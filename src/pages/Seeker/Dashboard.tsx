import { useEffect, useState } from 'react';
import { Briefcase, FileText, BookmarkIcon, TrendingUp, Clock, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Job, JobApplication } from '../../lib/supabase';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: appsData } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs(
            *,
            employer:employers(company_name, company_logo)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (appsData) {
        setApplications(appsData as any);
      }

      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:employers(company_name, company_logo)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (jobsData) {
        setRecommendedJobs(jobsData as any);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'viewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <Clock className="h-4 w-4" />;
      case 'viewed':
        return <Eye className="h-4 w-4" />;
      case 'shortlisted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {(profile as any)?.full_name}
          </h1>
          <p className="text-gray-600">Track your applications and discover new opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            <p className="text-gray-600 text-sm">Total Applications</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {applications.filter((app) => app.status === 'shortlisted').length}
            </p>
            <p className="text-gray-600 text-sm">Shortlisted</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-100 p-3 rounded-lg">
                <BookmarkIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-gray-600 text-sm">Saved Jobs</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-slate-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(profile as any)?.profile_completion || 0}%
            </p>
            <p className="text-gray-600 text-sm">Profile Completion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <button
                  onClick={() => onNavigate('applications')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't applied to any jobs yet</p>
                  <button
                    onClick={() => onNavigate('jobs')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => onNavigate('job-detail', { jobId: application.job_id })}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {application.job?.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {(application.job as any)?.employer?.company_name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{application.job?.location}</span>
                            <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Profile strength</span>
                  <span className="font-medium text-gray-900">
                    {(profile as any)?.profile_completion || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(profile as any)?.profile_completion || 0}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Complete Profile
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
              </div>
              <div className="space-y-4">
                {recommendedJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => onNavigate('job-detail', { jobId: job.id })}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{job.title}</h3>
                    <p className="text-gray-600 text-xs mb-2">
                      {(job as any).employer?.company_name}
                    </p>
                    <p className="text-gray-500 text-xs">{job.location}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('jobs')}
                className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition text-sm"
              >
                View All Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
