import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserRole, UserProfile, Employer } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  profile: UserProfile | Employer | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    role: UserRole,
    fullName: string
  ) => Promise<void>;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile | Employer>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<UserProfile | Employer | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- INITIAL SESSION ---------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        loadUserData(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setRole(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ---------------- ROLE RESOLUTION ---------------- */
  const loadUserData = async (userId: string) => {
    setLoading(true);

    try {
      // 1️⃣ Check seeker
      const { data: seeker } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (seeker) {
        setRole('seeker');
        setProfile(seeker);
        return;
      }

      // 2️⃣ Check employer
      const { data: employer } = await supabase
        .from('employers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (employer) {
        setRole('employer');
        setProfile(employer);
        return;
      }

      // ❗ Should never happen if signup is correct
      setRole(null);
      setProfile(null);
    } catch (err) {
      console.error('Auth load error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- AUTH ACTIONS ---------------- */
  const signUp = async (
    email: string,
    password: string,
    userRole: UserRole,
    fullName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    // Create role-specific profile
    if (userRole === 'seeker') {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          profile_completion: 20,
        });

      if (profileError) throw profileError;
    } else {
      const { error: employerError } = await supabase
        .from('employers')
        .insert({
          id: data.user.id,
          company_name: fullName,
          verified: false,
        });

      if (employerError) throw employerError;
    }

    // 🔑 Auto-login consistency
    await loadUserData(data.user.id);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) throw error;
  };

  const updateProfile = async (data: Partial<UserProfile | Employer>) => {
    if (!user || !role) return;

    const table = role === 'seeker' ? 'user_profiles' : 'employers';

    const { error } = await supabase
      .from(table)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;

    await loadUserData(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
