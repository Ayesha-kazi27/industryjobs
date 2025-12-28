import { useEffect, useState } from 'react';
import { Briefcase, Users, Eye, CheckCircle, PlusCircle, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Job } from '../../lib/supabase';

interface EmployerDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function EmployerDashboard({ onNavigate }: EmployerDashboardProps) {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          job_applications(count)
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsData) {
        setJobs(jobsData as any);

        const totalJobs = jobsData.length;
        const activeJobs = jobsData.filter((j) => j.status === 'active').length;

        const { data: applicationsData } = await supabase
          .from('job_applications')
          .select('*')
          .in(
            'job_id',
            jobsData.map((j) => j.id)
          );

        const totalApplications = applicationsData?.length || 0;
        const shortlisted = applicationsData?.filter((a) => a.status === 'shortlisted').length || 0;

        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          shortlisted,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await supabase.from('jobs').delete().eq('id', jobId);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';

    try {
      await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      loadDashboardData();
    } catch (error) {
      console.error('Error updating job:', error);
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Employer Dashboard
            </h1>
            <p className="text-gray-600">Manage your job postings and applications</p>
          </div>
          <button
            onClick={() => onNavigate('post-job')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
            <p className="text-gray-600 text-sm">Total Jobs</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
            <p className="text-gray-600 text-sm">Active Jobs</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            <p className="text-gray-600 text-sm">Total Applications</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-slate-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-slate-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
            <p className="text-gray-600 text-sm">Shortlisted</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Job Postings</h2>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
              <button
                onClick={() => onNavigate('post-job')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {job.status}
                        </span>
                        {job.is_urgent && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Urgent
                          </span>
                        )}
                        {job.is_featured && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <span>{job.location}</span>
                        <span>{job.job_type}</span>
                        <span>{job.industry_category}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <button
                          onClick={() => onNavigate('applicants', { jobId: job.id })}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <Users className="h-4 w-4" />
                          {(job as any).job_applications?.[0]?.count || 0} Applications
                        </button>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onNavigate('job-detail', { jobId: job.id })}
                        className="p-2 text-gray-600 hover:text-blue-600 transition"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onNavigate('edit-job', { jobId: job.id })}
                        className="p-2 text-gray-600 hover:text-blue-600 transition"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleJobStatus(job.id, job.status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          job.status === 'active'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {job.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
