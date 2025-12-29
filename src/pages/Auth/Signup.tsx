import { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Building,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../lib/supabase';

interface SignupProps {
  onNavigate: (page: string) => void;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function Signup({ onNavigate }: SignupProps) {
  const [role, setRole] = useState<UserRole>('seeker');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  // 🔐 Password strength logic
  const evaluatePasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score >= 3) return 'strong';
    if (score === 2) return 'medium';
    return 'weak';
  };

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (strength === 'weak') {
      setError('Password is too weak. Use letters and numbers.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, role, fullName);
      setSuccess(true);
      setTimeout(() => {
  if (role === 'employer') {
    onNavigate('employer-dashboard');
  } else {
    onNavigate('dashboard');
  }
}, 1200);

    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12
      bg-[radial-gradient(circle_at_top,_#f4f8ff_0%,_#eef3fb_45%,_#e8eef7_100%)]"
    >
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-2xl border border-slate-200
          shadow-[0_20px_40px_rgba(15,23,42,0.08),0_6px_12px_rgba(15,23,42,0.04)]
          p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Create your Industro account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Access industrial jobs across the country — from internships to experienced roles
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm text-green-700">
                Account created successfully. Redirecting…
              </p>
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-7">
            <p className="text-sm font-medium text-slate-700 mb-3">I am a</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'seeker', label: 'Job Seeker', desc: 'Find and apply for jobs', icon: Briefcase },
                { id: 'employer', label: 'Employer', desc: 'Post jobs and hire talent', icon: Building },
              ].map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id as UserRole)}
                  className={`rounded-xl border p-4 text-left transition
                    ${
                      role === id
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <Icon
                    className={`h-6 w-6 mb-2 ${
                      role === id ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  />
                  <p className="text-sm font-medium text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {role === 'seeker' ? 'Full Name' : 'Company Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  placeholder='John Doe'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-slate-300 pl-10 pr-4 text-sm
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                   placeholder='john@gmail.com'
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-slate-300 pl-10 pr-4 text-sm
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-slate-300 pl-10 pr-10 text-sm
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        strength === 'weak'
                          ? 'bg-red-500 w-1/3'
                          : strength === 'medium'
                          ? 'bg-yellow-500 w-2/3'
                          : 'bg-green-500 w-full'
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Password strength:{' '}
                    <span className="font-medium capitalize">{strength}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-12 rounded-xl border border-slate-300 pl-10 pr-10 text-sm
                    focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full h-12 rounded-xl font-semibold text-white
                bg-gradient-to-br from-blue-600 to-blue-700
                hover:from-blue-700 hover:to-blue-800
                shadow-md hover:shadow-lg transition
                disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Trusted by industrial employers across the country
          </p>
        </div>
      </div>
    </div>
  );
}
