import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-xl font-semibold text-center">Reset password</h1>

        {sent ? (
          <div className="mt-6 flex gap-2 bg-green-50 p-4 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm">Reset link sent to your email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Your email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 border rounded-xl"
              />
            </div>

            <button className="w-full h-12 bg-blue-600 text-white rounded-xl">
              Send reset link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
