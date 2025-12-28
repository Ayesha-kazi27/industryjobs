/*
  # Industrial Job Portal - Core Database Schema

  ## Overview
  This migration creates the foundational database structure for an industrial job portal
  connecting job seekers with employers in manufacturing, mechanical, electrical, civil,
  oil & gas, and other industrial sectors.

  ## New Tables

  ### 1. user_profiles
  Extended profile information for job seekers (links to auth.users)
  - `id` (uuid, references auth.users)
  - `full_name` (text)
  - `phone` (text)
  - `location` (text)
  - `preferred_job_type` (text) - full-time, part-time, contract
  - `preferred_shift` (text) - day, night, rotating
  - `years_experience` (integer)
  - `bio` (text)
  - `resume_url` (text) - stored resume file
  - `profile_completion` (integer) - percentage
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. employers
  Employer/company accounts
  - `id` (uuid, references auth.users)
  - `company_name` (text)
  - `company_logo` (text)
  - `company_size` (text)
  - `industry_type` (text)
  - `website` (text)
  - `description` (text)
  - `location` (text)
  - `contact_email` (text)
  - `contact_phone` (text)
  - `verified` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. skills
  Master list of skills for the industrial sector
  - `id` (uuid)
  - `name` (text, unique)
  - `category` (text) - technical, soft, certification
  - `created_at` (timestamptz)

  ### 4. user_skills
  Job seeker skills with proficiency levels
  - `id` (uuid)
  - `user_id` (uuid, references user_profiles)
  - `skill_id` (uuid, references skills)
  - `proficiency` (text) - beginner, intermediate, advanced, expert
  - `created_at` (timestamptz)

  ### 5. education
  Educational qualifications
  - `id` (uuid)
  - `user_id` (uuid, references user_profiles)
  - `degree` (text)
  - `field` (text)
  - `institution` (text)
  - `year_completed` (integer)
  - `created_at` (timestamptz)

  ### 6. certifications
  Professional certifications
  - `id` (uuid)
  - `user_id` (uuid, references user_profiles)
  - `name` (text)
  - `issuing_organization` (text)
  - `issue_date` (date)
  - `expiry_date` (date)
  - `credential_id` (text)
  - `created_at` (timestamptz)

  ### 7. jobs
  Job postings by employers
  - `id` (uuid)
  - `employer_id` (uuid, references employers)
  - `title` (text)
  - `description` (text)
  - `industry_category` (text)
  - `job_role` (text)
  - `location` (text)
  - `job_type` (text) - full-time, part-time, contract
  - `shift_type` (text)
  - `experience_min` (integer)
  - `experience_max` (integer)
  - `salary_min` (integer)
  - `salary_max` (integer)
  - `salary_currency` (text)
  - `is_urgent` (boolean)
  - `is_featured` (boolean)
  - `status` (text) - active, paused, closed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. job_skills
  Skills required for specific jobs
  - `id` (uuid)
  - `job_id` (uuid, references jobs)
  - `skill_id` (uuid, references skills)
  - `required` (boolean) - true if mandatory
  - `created_at` (timestamptz)

  ### 9. job_applications
  Applications submitted by job seekers
  - `id` (uuid)
  - `job_id` (uuid, references jobs)
  - `user_id` (uuid, references user_profiles)
  - `resume_url` (text)
  - `cover_letter` (text)
  - `status` (text) - applied, viewed, shortlisted, rejected
  - `match_score` (integer) - calculated match percentage
  - `employer_notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 10. saved_jobs
  Jobs bookmarked by users
  - `id` (uuid)
  - `user_id` (uuid, references user_profiles)
  - `job_id` (uuid, references jobs)
  - `created_at` (timestamptz)

  ### 11. saved_searches
  Saved search queries with filters
  - `id` (uuid)
  - `user_id` (uuid, references user_profiles)
  - `name` (text)
  - `filters` (jsonb) - stored filter criteria
  - `created_at` (timestamptz)

  ### 12. notifications
  System notifications for users and employers
  - `id` (uuid)
  - `user_id` (uuid, references auth.users)
  - `type` (text) - job_match, application_update, etc.
  - `title` (text)
  - `message` (text)
  - `read` (boolean)
  - `link` (text)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only view/edit their own data
  - Employers can only manage their own jobs and view applicants
  - Public read access for active jobs
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  location text,
  preferred_job_type text,
  preferred_shift text,
  years_experience integer DEFAULT 0,
  bio text,
  resume_url text,
  profile_completion integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employers table
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  company_name text NOT NULL,
  company_logo text,
  company_size text,
  industry_type text,
  website text,
  description text,
  location text,
  contact_email text,
  contact_phone text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  proficiency text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  degree text NOT NULL,
  field text NOT NULL,
  institution text NOT NULL,
  year_completed integer,
  created_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date,
  expiry_date date,
  credential_id text,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  industry_category text NOT NULL,
  job_role text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL,
  shift_type text,
  experience_min integer DEFAULT 0,
  experience_max integer,
  salary_min integer,
  salary_max integer,
  salary_currency text DEFAULT 'USD',
  is_urgent boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_skills table
CREATE TABLE IF NOT EXISTS job_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  required boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, skill_id)
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  resume_url text,
  cover_letter text,
  status text DEFAULT 'applied',
  match_score integer,
  employer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  filters jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Employers can view applicant profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_applications ja
      JOIN jobs j ON j.id = ja.job_id
      WHERE ja.user_id = user_profiles.id
      AND j.employer_id = auth.uid()
    )
  );

-- RLS Policies for employers
CREATE POLICY "Employers can view own profile"
  ON employers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Employers can update own profile"
  ON employers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Employers can insert own profile"
  ON employers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view verified employers"
  ON employers FOR SELECT
  TO authenticated
  USING (verified = true);

-- RLS Policies for skills (public read)
CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_skills
CREATE POLICY "Users can manage own skills"
  ON user_skills FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can view applicant skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_applications ja
      JOIN jobs j ON j.id = ja.job_id
      WHERE ja.user_id = user_skills.user_id
      AND j.employer_id = auth.uid()
    )
  );

-- RLS Policies for education
CREATE POLICY "Users can manage own education"
  ON education FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can view applicant education"
  ON education FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_applications ja
      JOIN jobs j ON j.id = ja.job_id
      WHERE ja.user_id = education.user_id
      AND j.employer_id = auth.uid()
    )
  );

-- RLS Policies for certifications
CREATE POLICY "Users can manage own certifications"
  ON certifications FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can view applicant certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_applications ja
      JOIN jobs j ON j.id = ja.job_id
      WHERE ja.user_id = certifications.user_id
      AND j.employer_id = auth.uid()
    )
  );

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Employers can manage own jobs"
  ON jobs FOR ALL
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

-- RLS Policies for job_skills
CREATE POLICY "Anyone can view job skills"
  ON job_skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_skills.job_id
      AND jobs.status = 'active'
    )
  );

CREATE POLICY "Employers can manage own job skills"
  ON job_skills FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_skills.job_id
      AND jobs.employer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_skills.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- RLS Policies for job_applications
CREATE POLICY "Users can view own applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create applications"
  ON job_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own applications"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can view applications for own jobs"
  ON job_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update applications for own jobs"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- RLS Policies for saved_jobs
CREATE POLICY "Users can manage own saved jobs"
  ON saved_jobs FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for saved_searches
CREATE POLICY "Users can manage own saved searches"
  ON saved_searches FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(industry_category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

-- Insert default skills for industrial sector
INSERT INTO skills (name, category) VALUES
  ('Welding', 'technical'),
  ('CNC Operation', 'technical'),
  ('Electrical Maintenance', 'technical'),
  ('Mechanical Repair', 'technical'),
  ('PLC Programming', 'technical'),
  ('HVAC Systems', 'technical'),
  ('Quality Control', 'technical'),
  ('Blueprint Reading', 'technical'),
  ('Forklift Operation', 'technical'),
  ('Safety Compliance', 'technical'),
  ('Lean Manufacturing', 'technical'),
  ('Six Sigma', 'certification'),
  ('OSHA Certification', 'certification'),
  ('Project Management', 'soft'),
  ('Team Leadership', 'soft'),
  ('Problem Solving', 'soft'),
  ('Communication', 'soft'),
  ('Time Management', 'soft'),
  ('AutoCAD', 'technical'),
  ('SolidWorks', 'technical'),
  ('Hydraulics', 'technical'),
  ('Pneumatics', 'technical'),
  ('Instrumentation', 'technical'),
  ('Pipefitting', 'technical'),
  ('Fabrication', 'technical')
ON CONFLICT (name) DO NOTHING;
