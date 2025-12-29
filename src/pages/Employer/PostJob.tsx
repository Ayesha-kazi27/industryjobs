import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function PostJob({ onNavigate }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    industry_category: '',
    location: '',
  });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || skills.includes(skill)) return;
    setSkills([...skills, skill]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from('jobs').insert({
      employer_id: user.id,
      title: form.title,
      description: form.description,
      industry_category: form.industry_category,
      location: form.location,
      status: 'active',
      custom_skills: skills, // ✅ ONLY PLACE SKILLS LIVE
    });

    if (!error) {
      onNavigate('employer-dashboard');
    } else {
      console.error(error);
      alert('Failed to post job');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg space-y-5">

        <input
          placeholder="Job Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          placeholder="Job Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border p-3 rounded"
          required
        />

        <input
          placeholder="Industry"
          value={form.industry_category}
          onChange={e => setForm({ ...form, industry_category: e.target.value })}
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          className="w-full border p-3 rounded"
        />

        {/* SKILLS */}
        <div>
          <label className="text-sm font-medium">Required Skills</label>

          <div className="flex gap-2 mt-2">
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <button type="button" onClick={addSkill}>
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map(skill => (
              <span key={skill} className="bg-blue-100 px-3 py-1 rounded flex gap-2">
                {skill}
                <X
                  className="cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          {loading ? 'Posting…' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
