import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Award, FileText, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase, JobApplication, Job } from '../../lib/supabase';

interface ApplicantsProps {
  jobId: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function Applicants({ jobId, onNavigate }: ApplicantsProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    try {
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobData) setJob(jobData);

      const { data: applicationsData } = await supabase
        .from('job_applications')
        .select(`
          *,
          user_profile:user_profiles(*),
          user_skills:user_skills(*, skill:skills(*)),
          education:education(*),
          certifications:certifications(*)
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (applicationsData) {
        setApplications(applicationsData as any);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await supabase
        .from('job_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      loadApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const saveNotes = async (applicationId: string, notes: string) => {
    try {
      await supabase
        .from('job_applications')
        .update({ employer_notes: notes })
        .eq('id', applicationId);

      loadApplications();
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('employer-dashboard')}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Applicants for {job?.title}
          </h1>
          <p className="text-gray-600">{applications.length} total applications</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter('applied')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'applied'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Applied ({applications.filter((a) => a.status === 'applied').length})
            </button>
            <button
              onClick={() => setFilter('shortlisted')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'shortlisted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shortlisted ({applications.filter((a) => a.status === 'shortlisted').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'rejected'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({applications.filter((a) => a.status === 'rejected').length})
            </button>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No applications in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  onClick={() => setSelectedApplication(application)}
                  className={`bg-white rounded-lg p-4 cursor-pointer transition ${
                    selectedApplication?.id === application.id
                      ? 'ring-2 ring-blue-600 shadow-md'
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {(application as any).user_profile?.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {(application as any).user_profile?.years_experience} years exp.
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Applied {new Date(application.created_at).toLocaleDateString()}
                  </p>
                  {application.match_score && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Match Score</span>
                        <span className="font-medium">{application.match_score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${application.match_score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedApplication && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {(selectedApplication as any).user_profile?.full_name}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {(selectedApplication as any).user_profile?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {(selectedApplication as any).user_profile.location}
                          </span>
                        )}
                        {(selectedApplication as any).user_profile?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {(selectedApplication as any).user_profile.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'shortlisted')}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                        title="Shortlist"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(selectedApplication as any).user_profile?.bio && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                        <p className="text-gray-700">{(selectedApplication as any).user_profile.bio}</p>
                      </div>
                    )}

                    {(selectedApplication as any).user_skills && (selectedApplication as any).user_skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(selectedApplication as any).user_skills.map((us: any) => (
                            <span
                              key={us.id}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {us.skill?.name} - {us.proficiency}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApplication.cover_letter && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                        <p className="text-gray-700 whitespace-pre-line">{selectedApplication.cover_letter}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                      <textarea
                        defaultValue={selectedApplication.employer_notes || ''}
                        onBlur={(e) => saveNotes(selectedApplication.id, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add internal notes about this candidate..."
                      />
                    </div>

                    {selectedApplication.resume_url && (
                      <div>
                        <a
                          href={selectedApplication.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <FileText className="h-5 w-5" />
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
