import { useEffect, useState } from 'react';
import { MapPin, Briefcase, DollarSign, Clock, Calendar, Building, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Job } from '../../lib/supabase';

interface JobDetailProps {
  jobId: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function JobDetail({ jobId, onNavigate }: JobDetailProps) {
  const { user, role } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const { data: jobData } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:employers(*),
          job_skills(*, skill:skills(*))
        `)
        .eq('id', jobId)
        .single();

      if (jobData) {
        setJob(jobData as any);

        if (user && role === 'seeker') {
          const { data: applicationData } = await supabase
            .from('job_applications')
            .select('id')
            .eq('job_id', jobId)
            .eq('user_id', user.id)
            .maybeSingle();

          setHasApplied(!!applicationData);
        }
      }
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    setApplying(true);

    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('resume_url')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          user_id: user.id,
          resume_url: profileData?.resume_url,
          cover_letter: coverLetter,
          status: 'applied',
        });

      if (error) throw error;

      setApplicationSuccess(true);
      setHasApplied(true);
      setTimeout(() => {
        setShowApplicationModal(false);
        setApplicationSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('jobs')}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Jobs
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                {job.is_urgent && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                    Urgent
                  </span>
                )}
                {job.is_featured && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                {(job as any).employer?.company_logo && (
                  <img
                    src={(job as any).employer.company_logo}
                    alt="Company"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {(job as any).employer?.company_name}
                  </h2>
                  <p className="text-gray-600">{(job as any).employer?.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Job Type</p>
                    <p className="font-medium">{job.job_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Shift</p>
                    <p className="font-medium">{job.shift_type || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-medium">{job.experience_min}+ years</p>
                  </div>
                </div>
              </div>

              {job.salary_min && job.salary_max && (
                <div className="flex items-center gap-2 text-gray-700 mb-6">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Salary Range</p>
                    <p className="font-medium text-lg">
                      {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} {job.salary_currency}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {role === 'seeker' && (
              <div>
                {hasApplied ? (
                  <button
                    disabled
                    className="bg-green-100 text-green-800 px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Applied
                  </button>
                ) : (
                  <button
                    onClick={() => setShowApplicationModal(true)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(job as any).job_skills?.map((jobSkill: any) => (
                  <span
                    key={jobSkill.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      jobSkill.required
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {jobSkill.skill?.name}
                    {jobSkill.required && ' *'}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">* Required skills</p>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="h-5 w-5" />
                About Company
              </h3>
              <p className="text-gray-700 mb-4">{(job as any).employer?.description || 'No description available'}</p>
              {(job as any).employer?.website && (
                <a
                  href={(job as any).employer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Visit Website →
                </a>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Job Category</h3>
              <p className="text-gray-700 mb-4">{job.industry_category}</p>
              <h3 className="font-semibold text-gray-900 mb-2">Posted</h3>
              <p className="text-gray-700">{new Date(job.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {showApplicationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8">
              {applicationSuccess ? (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                  <p className="text-gray-600">Your application has been sent to the employer.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for {job.title}</h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Why are you interested in this position?"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowApplicationModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
