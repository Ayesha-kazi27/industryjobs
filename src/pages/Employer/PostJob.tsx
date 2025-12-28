import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Skill } from '../../lib/supabase';

interface PostJobProps {
  onNavigate: (page: string) => void;
}

export default function PostJob({ onNavigate }: PostJobProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<{ id: string; required: boolean }[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    industry_category: '',
    job_role: '',
    location: '',
    job_type: 'full-time',
    shift_type: 'day',
    experience_min: 0,
    experience_max: 0,
    salary_min: 0,
    salary_max: 0,
    salary_currency: 'USD',
    is_urgent: false,
    is_featured: false,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('name');
    if (data) setAllSkills(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .insert({
          ...formData,
          employer_id: user.id,
          status: 'active',
        })
        .select()
        .single();

      if (jobError) throw jobError;

      if (selectedSkills.length > 0 && jobData) {
        const jobSkillsData = selectedSkills.map((skill) => ({
          job_id: jobData.id,
          skill_id: skill.id,
          required: skill.required,
        }));

        const { error: skillsError } = await supabase
          .from('job_skills')
          .insert(jobSkillsData);

        if (skillsError) throw skillsError;
      }

      alert('Job posted successfully!');
      onNavigate('employer-dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId: string) => {
    const exists = selectedSkills.find((s) => s.id === skillId);
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, { id: skillId, required: true }]);
    }
  };

  const toggleSkillRequired = (skillId: string) => {
    setSelectedSkills(
      selectedSkills.map((s) =>
        s.id === skillId ? { ...s, required: !s.required } : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Fill in the details below to create a job posting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Job Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Senior Mechanical Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Category *
                  </label>
                  <select
                    value={formData.industry_category}
                    onChange={(e) => setFormData({ ...formData, industry_category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Civil">Civil</option>
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Construction">Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    value={formData.job_role}
                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Engineer, Technician, Operator"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift Type
                  </label>
                  <select
                    value={formData.shift_type}
                    onChange={(e) => setFormData({ ...formData, shift_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                    <option value="rotating">Rotating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Experience (years) *
                  </label>
                  <input
                    type="number"
                    value={formData.experience_min}
                    onChange={(e) => setFormData({ ...formData, experience_min: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Experience (years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience_max}
                    onChange={(e) => setFormData({ ...formData, experience_max: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.salary_currency}
                    onChange={(e) => setFormData({ ...formData, salary_currency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_urgent}
                    onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mark as Urgent</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mark as Featured</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Required Skills</h2>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSkills.map((selected) => {
                  const skill = allSkills.find((s) => s.id === selected.id);
                  return (
                    <div
                      key={selected.id}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                    >
                      <span>{skill?.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleSkillRequired(selected.id)}
                        className="text-xs opacity-75 hover:opacity-100"
                      >
                        {selected.required ? '(Required)' : '(Optional)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSkill(selected.id)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {allSkills
                  .filter((skill) => !selectedSkills.find((s) => s.id === skill.id))
                  .map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition text-left"
                    >
                      {skill.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => onNavigate('employer-dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
