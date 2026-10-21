import React, { useState } from 'react';
import { Lock, User, ShieldAlert, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { firebaseStore } from '../../services/firebase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [username, setUsername] = useState<string>('mydebidwar');
  const [password, setPassword] = useState<string>('');
  const [showUsername, setShowUsername] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('অনুগ্রহ করে ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await firebaseStore.loginAdmin(username.trim(), password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'লগইনে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative">
        <button
          onClick={onBackToStore}
          className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরুন</span>
        </button>

        <div className="text-center mt-6 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            অ্যাডমিন প্রবেশদ্বার
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            HBC PANARPUL — ব্যবস্থাপনা ও কন্ট্রোল প্যানেল
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-300">
                ইউজার আইডি (Username — গোপন/হাইড)
              </label>
              <button
                type="button"
                onClick={() => setShowUsername(!showUsername)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                {showUsername ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>হাইড করুন</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>দেখান</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showUsername ? 'text' : 'password'}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden font-mono tracking-wider"
              />
              <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowUsername(!showUsername)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                title={showUsername ? 'ইউজারনেম হাইড করুন' : 'ইউজারনেম দেখুন'}
              >
                {showUsername ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-300">
                পাসওয়ার্ড (Password — হাইট/গোপন থাকবে)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>হাইড করুন</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>দেখান</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-hidden font-mono tracking-wider"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
                title={showPassword ? 'পাসওয়ার্ড হাইড করুন' : 'পাসওয়ার্ড দেখুন'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Auto-fill button for authorized credentials */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>ইউজার আইডি ও পাসওয়ার্ড সংরক্ষিত</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setUsername('mydebidwar');
                setPassword('1985fahim@');
              }}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer font-medium"
            >
              স্বয়ংক্রিয় পূরণ
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <span>নিরাপদে লগইন করুন</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800/80 text-center text-[11px] text-stone-500">
          সুরক্ষিত ফায়ারবেস অথেন্টিকেশন সেশন। শুধুমাত্র অনুমোদিত মালিক ও পরিচালকের জন্য প্রযোজ্য।
        </div>
      </div>
    </div>
  );
};
