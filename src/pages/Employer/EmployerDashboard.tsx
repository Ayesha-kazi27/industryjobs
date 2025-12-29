import { useEffect, useState } from 'react';
import {
  Briefcase,
  Users,
  Eye,
  CheckCircle,
  PlusCircle,
  Edit,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Job } from '../../lib/supabase';

interface EmployerDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function EmployerDashboard({ onNavigate }: EmployerDashboardProps) {
  const { user, role } = useAuth();

  if (!user || role !== 'employer') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Unauthorized
      </div>
    );
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(jobsData || []);

      const jobIds = (jobsData || []).map(j => j.id);

      let totalApplications = 0;
      let shortlisted = 0;

      if (jobIds.length > 0) {
        const { data: apps } = await supabase
          .from('job_applications')
          .select('status')
          .in('job_id', jobIds);

        totalApplications = apps?.length || 0;
        shortlisted = apps?.filter(a => a.status === 'shortlisted').length || 0;
      }

      setStats({
        totalJobs: jobsData.length,
        activeJobs: jobsData.filter(j => j.status === 'active').length,
        totalApplications,
        shortlisted,
      });
    } catch (err) {
      console.error('Employer dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (jobId: string, status: string) => {
    await supabase
      .from('jobs')
      .update({ status: status === 'active' ? 'paused' : 'active' })
      .eq('id', jobId);

    loadDashboard();
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Delete this job?')) return;

    await supabase.from('jobs').delete().eq('id', jobId);
    loadDashboard();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading employer dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-gray-600">Manage your job postings</p>
          </div>

          <button
            onClick={() => onNavigate('post-job')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Post Job
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Stat icon={<Briefcase />} label="Total Jobs" value={stats.totalJobs} />
          <Stat icon={<TrendingUp />} label="Active Jobs" value={stats.activeJobs} />
          <Stat icon={<Users />} label="Applications" value={stats.totalApplications} />
          <Stat icon={<CheckCircle />} label="Shortlisted" value={stats.shortlisted} />
        </div>

        {/* JOB LIST */}
        {jobs.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            You haven’t posted any jobs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                      {job.location} · {job.industry_category}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(job.id, job.status)}>
                      {job.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button onClick={() => deleteJob(job.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
