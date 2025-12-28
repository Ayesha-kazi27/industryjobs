import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'seeker' | 'employer';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  location?: string;
  preferred_job_type?: string;
  preferred_shift?: string;
  years_experience: number;
  bio?: string;
  resume_url?: string;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

export interface Employer {
  id: string;
  company_name: string;
  company_logo?: string;
  company_size?: string;
  industry_type?: string;
  website?: string;
  description?: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  industry_category: string;
  job_role: string;
  location: string;
  job_type: string;
  shift_type?: string;
  experience_min: number;
  experience_max?: number;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  is_urgent: boolean;
  is_featured: boolean;
  status: 'active' | 'paused' | 'closed';
  created_at: string;
  updated_at: string;
  employer?: Employer;
  job_skills?: JobSkill[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'certification';
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
  skill?: Skill;
}

export interface JobSkill {
  id: string;
  job_id: string;
  skill_id: string;
  required: boolean;
  created_at: string;
  skill?: Skill;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  resume_url?: string;
  cover_letter?: string;
  status: 'applied' | 'viewed' | 'shortlisted' | 'rejected';
  match_score?: number;
  employer_notes?: string;
  created_at: string;
  updated_at: string;
  job?: Job;
  user_profile?: UserProfile;
}

export interface Education {
  id: string;
  user_id: string;
  degree: string;
  field: string;
  institution: string;
  year_completed?: number;
  created_at: string;
}

export interface Certification {
  id: string;
  user_id: string;
  name: string;
  issuing_organization: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
}
