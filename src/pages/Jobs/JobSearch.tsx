import { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, X, Bookmark, AlertCircle } from 'lucide-react';
import { supabase, Job } from '../../lib/supabase';

interface JobSearchProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function JobSearch({ onNavigate }: JobSearchProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    industry: '',
    jobType: '',
    experienceMin: '',
    experienceMax: '',
    shiftType: '',
  });

  const industries = [
    'Manufacturing',
    'Mechanical',
    'Electrical',
    'Civil',
    'Oil & Gas',
    'Construction',
  ];

  const jobTypes = ['full-time', 'part-time', 'contract'];
  const shiftTypes = ['day', 'night', 'rotating'];

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const loadJobs = async () => {
    try {
      const { data } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:employers(company_name, company_logo, location)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (data) {
        setJobs(data as any);
        setFilteredJobs(data as any);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.search) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.industry) {
      filtered = filtered.filter((job) => job.industry_category === filters.industry);
    }

    if (filters.jobType) {
      filtered = filtered.filter((job) => job.job_type === filters.jobType);
    }

    if (filters.shiftType) {
      filtered = filtered.filter((job) => job.shift_type === filters.shiftType);
    }

    if (filters.experienceMin) {
      filtered = filtered.filter((job) => job.experience_min >= parseInt(filters.experienceMin));
    }

    if (filters.experienceMax) {
      filtered = filtered.filter((job) => job.experience_max! <= parseInt(filters.experienceMax));
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      industry: '',
      jobType: '',
      experienceMin: '',
      experienceMax: '',
      shiftType: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Job</h1>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Job title or keywords"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    placeholder="City or state"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      value={filters.industry}
                      onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Industries</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shift Type
                    </label>
                    <select
                      value={filters.shiftType}
                      onChange={(e) => setFilters({ ...filters, shiftType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Shifts</option>
                      {shiftTypes.map((shift) => (
                        <option key={shift} value={shift}>
                          {shift}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Experience (years)
                    </label>
                    <input
                      type="number"
                      value={filters.experienceMin}
                      onChange={(e) => setFilters({ ...filters, experienceMin: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Experience (years)
                    </label>
                    <input
                      type="number"
                      value={filters.experienceMax}
                      onChange={(e) => setFilters({ ...filters, experienceMax: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
            </p>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => onNavigate('job-detail', { jobId: job.id })}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {(job as any).employer?.company_logo && (
                        <img
                          src={(job as any).employer.company_logo}
                          alt="Company"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          {job.is_urgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                              Urgent
                            </span>
                          )}
                          {job.is_featured && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{(job as any).employer?.company_name}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.job_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.shift_type}
                          </span>
                          {job.salary_min && job.salary_max && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} {job.salary_currency}
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-gray-700 line-clamp-2">{job.description}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition"
                  >
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
