
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    height: '',
    weight: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.age) {
      onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-pink-50 animate-fadeIn">
      <div className="bg-white shadow-2xl rounded-[40px] w-full max-w-md p-8 border-t-8 border-blue-400">
        <div className="text-center mb-8">
          <div className="bg-blue-100 text-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
            <i className="fas fa-user-md"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">أهلاً بك في طمني</h1>
          <p className="text-gray-500 font-medium italic">رفيقك الصحي الذكي للغد أفضل ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 block px-1">الاسم الكريم</label>
            <input 
              required
              type="text" 
              placeholder="مثال: محمد"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-400 transition-all text-gray-800"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 block px-1">العمر</label>
              <input 
                required
                type="number" 
                placeholder="25"
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-400 transition-all text-gray-800"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 block px-1">الطول (سم)</label>
              <input 
                type="number" 
                placeholder="170"
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-400 transition-all text-gray-800"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 block px-1">الوزن (كجم)</label>
            <input 
              type="number" 
              placeholder="70"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-400 transition-all text-gray-800"
              value={profile.weight}
              onChange={(e) => setProfile({...profile, weight: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95 mt-4"
          >
            ابدأ رحلتك الصحية 🚀
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 mb-1">إعداد دكتورة المستقبل</p>
          <p className="text-xs font-bold text-gray-700 uppercase tracking-tight">Dr. NWAIF NAIF Al-Yami</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
