"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Eye, EyeOff, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/student/login?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            router.push('/dashboard');
          }
        }
      } catch (err) {
        console.error('Session verify failed on login page mount:', err);
      }
    }
    checkSession();
  }, [router]);

  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Validation errors
  const [codeError, setCodeError] = useState('');
  const [passError, setPassError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCodeError('');
    setPassError('');

    // Client-side validations
    let isValid = true;
    if (!studentCode.trim()) {
      setCodeError('Student Code is required');
      isValid = false;
    }
    if (!password) {
      setPassError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentCode: studentCode.trim(),
          password: password,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error?.message || 'Invalid Student Code or Password');
      } else {
        // Successful login
        // Save current student code in local storage as well for convenience
        localStorage.setItem('dp-student-code', json.data.studentCode);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FFF7F2] via-[#FFFFFF] to-[#FFF9F5] flex flex-col items-center justify-center p-4">
      {/* Glow decorations */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-red-50/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-[#FF5A1F] text-white shadow-lg shadow-orange-500/20 mb-4 animate-bounce">
            <Flame className="w-8 h-8 fill-orange-100/20" />
          </div>
          <h2 className="text-sm font-black text-orange-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500" /> DevPhoenix Academy
          </h2>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Student Portal</h1>
          <p className="text-sm text-slate-500 mt-2">
            Log in to access your customized industrial training workspace.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-md border border-orange-100/60 rounded-3xl p-8 shadow-xl shadow-orange-100/30">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="student-code" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Student Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-code"
                  type="text"
                  placeholder="e.g. DP-AIML-4096"
                  value={studentCode}
                  onChange={(e) => {
                    setStudentCode(e.target.value);
                    if (e.target.value) setCodeError('');
                  }}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                    codeError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200/80 focus:border-orange-400 focus:ring-orange-100'
                  } rounded-xl text-sm text-slate-900 outline-none transition-all focus:ring-4`}
                />
              </div>
              {codeError && <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {codeError}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Personal Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value) setPassError('');
                  }}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 border ${
                    passError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200/80 focus:border-orange-400 focus:ring-orange-100'
                  } rounded-xl text-sm text-slate-900 outline-none transition-all focus:ring-4`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passError && <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {passError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white rounded-xl font-bold text-sm shadow-md shadow-orange-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In to Workspace'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Trainee Demo Accounts
            </h4>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setStudentCode('DP-AIML-4096');
                  setPassword('password123');
                  setError('');
                  setCodeError('');
                  setPassError('');
                }}
                className="w-full p-3 text-left rounded-xl bg-orange-50/50 hover:bg-orange-50 border border-orange-100/50 hover:border-orange-200/80 transition-all group flex justify-between items-center"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">Soham Ghosh (AI Trainee)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Code: <code className="bg-orange-100/40 px-1 rounded text-orange-700">DP-AIML-4096</code> | Pass: <code className="bg-orange-100/40 px-1 rounded text-orange-700">password123</code></p>
                </div>
                <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">Auto-fill &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStudentCode('DP-FS-2026');
                  setPassword('password123');
                  setError('');
                  setCodeError('');
                  setPassError('');
                }}
                className="w-full p-3 text-left rounded-xl bg-orange-50/50 hover:bg-orange-50 border border-orange-100/50 hover:border-orange-200/80 transition-all group flex justify-between items-center"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">Ananya Sharma (FS Trainee)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Code: <code className="bg-orange-100/40 px-1 rounded text-orange-700">DP-FS-2026</code> | Pass: <code className="bg-orange-100/40 px-1 rounded text-orange-700">password123</code></p>
                </div>
                <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">Auto-fill &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-orange-600 font-bold transition-colors">
            &larr; Back to DevPhoenix Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
