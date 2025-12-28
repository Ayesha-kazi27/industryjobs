import { useEffect, useState } from 'react';
import { User, MapPin, Phone, Briefcase, Award, GraduationCap, Plus, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, UserSkill, Education, Certification, Skill } from '../../lib/supabase';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { profile, updateProfile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    preferred_job_type: '',
    preferred_shift: '',
    years_experience: 0,
    bio: '',
  });

  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: (profile as any).full_name || '',
        phone: (profile as any).phone || '',
        location: (profile as any).location || '',
        preferred_job_type: (profile as any).preferred_job_type || '',
        preferred_shift: (profile as any).preferred_shift || '',
        years_experience: (profile as any).years_experience || 0,
        bio: (profile as any).bio || '',
      });
    }
    loadProfileData();
  }, [profile]);

  const loadProfileData = async () => {
    if (!user) return;

    const { data: skillsData } = await supabase
      .from('user_skills')
      .select('*, skill:skills(*)')
      .eq('user_id', user.id);

    const { data: eduData } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id);

    const { data: certData } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', user.id);

    const { data: allSkillsData } = await supabase
      .from('skills')
      .select('*')
      .order('name');

    if (skillsData) setUserSkills(skillsData as any);
    if (eduData) setEducation(eduData);
    if (certData) setCertifications(certData);
    if (allSkillsData) setAllSkills(allSkillsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillId: string, proficiency: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_skills')
        .insert({ user_id: user.id, skill_id: skillId, proficiency });

      if (!error) {
        loadProfileData();
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const removeSkill = async (skillId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('id', skillId);

      loadProfileData();
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Job Type
                </label>
                <select
                  value={formData.preferred_job_type}
                  onChange={(e) => setFormData({ ...formData, preferred_job_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Shift
                </label>
                <select
                  value={formData.preferred_shift}
                  onChange={(e) => setFormData({ ...formData, preferred_shift: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                  <option value="rotating">Rotating</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell employers about your experience and skills..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Skills
            </h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {userSkills.map((userSkill) => (
                <div
                  key={userSkill.id}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{userSkill.skill?.name}</span>
                  <span className="text-xs opacity-75">({userSkill.proficiency})</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(userSkill.id)}
                    className="hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                id="skill-select"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a skill...</option>
                {allSkills
                  .filter((skill) => !userSkills.find((us) => us.skill_id === skill.id))
                  .map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
              </select>

              <select
                id="proficiency-select"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                const skillSelect = document.getElementById('skill-select') as HTMLSelectElement;
                const proficiencySelect = document.getElementById('proficiency-select') as HTMLSelectElement;
                if (skillSelect.value) {
                  addSkill(skillSelect.value, proficiencySelect.value);
                  skillSelect.value = '';
                }
              }}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
