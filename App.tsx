
import React, { useState, useEffect } from 'react';
import Tamenni from './components/Tamenni';
import Onboarding from './components/Onboarding';
import { AppTab, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Tamenni);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tamenni_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('tamenni_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    localStorage.removeItem('tamenni_profile');
    setUserProfile(null);
    setActiveTab(AppTab.Tamenni);
  };

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen pb-24 flex flex-col bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header Bar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
             <div className="bg-blue-500 text-white p-2 rounded-lg">
               <i className="fas fa-user-md"></i>
             </div>
             <span className="text-xl font-bold text-gray-800">Tamenni</span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium mt-1">
            إعداد دكتورة المستقبل Dr. NWAIF NAIF Al-Yami
          </span>
        </div>
        <div className="flex gap-4">
           <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <i className="fas fa-bell"></i>
           </button>
           <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <i className="fas fa-cog"></i>
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === AppTab.Tamenni && <Tamenni />}
        {activeTab === AppTab.Profile && (
           <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-[40px] shadow-xl max-w-md mx-auto animate-fadeIn mt-6 border-2 border-gray-50">
              <div className="relative">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}`} 
                  alt="Avatar" 
                  className="w-28 h-28 rounded-full border-4 border-blue-400 mb-4 bg-blue-50 shadow-lg" 
                />
                <div className="absolute bottom-4 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800">مرحباً، {userProfile.name}</h2>
              <p className="text-gray-500 mb-6">رفيقك الصحي مستعد لخدمتك 🩺</p>
              
              <div className="w-full grid grid-cols-2 gap-3 mb-6">
                 <div className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-400 uppercase">العمر</span>
                    <span className="text-xl font-bold text-blue-700">{userProfile.age} عام</span>
                 </div>
                 <div className="flex flex-col items-center p-4 bg-pink-50 rounded-2xl border border-pink-100">
                    <span className="text-xs font-bold text-pink-400 uppercase">الوزن</span>
                    <span className="text-xl font-bold text-pink-700">{userProfile.weight || '--'} كجم</span>
                 </div>
                 <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-400 uppercase">الطول</span>
                    <span className="text-xl font-bold text-indigo-700">{userProfile.height || '--'} سم</span>
                 </div>
                 <div className="flex flex-col items-center p-4 bg-green-50 rounded-2xl border border-green-100">
                    <span className="text-xs font-bold text-green-400 uppercase">الحالة</span>
                    <span className="text-xl font-bold text-green-700">نشط</span>
                 </div>
              </div>

              <div className="w-full space-y-3">
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 text-red-500 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  تسجيل الخروج
                </button>
              </div>

              <div className="pt-8 mt-6 border-t border-gray-50 w-full text-center">
                <p className="text-[10px] text-gray-300">التطبيق من إعداد:</p>
                <p className="font-bold text-blue-300 text-xs">Dr. NWAIF NAIF Al-Yami</p>
              </div>
           </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[70%] max-w-xs bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[32px] flex justify-around items-center p-3 z-50">
        <button 
          onClick={() => setActiveTab(AppTab.Tamenni)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === AppTab.Tamenni ? 'text-blue-500 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className={`p-2 px-6 rounded-2xl ${activeTab === AppTab.Tamenni ? 'bg-blue-100' : ''}`}>
            <i className="fas fa-heart-pulse text-xl"></i>
          </div>
          <span className="text-[10px] font-bold">طمني</span>
        </button>

        <button 
          onClick={() => setActiveTab(AppTab.Profile)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === AppTab.Profile ? 'text-indigo-500 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className={`p-2 px-6 rounded-2xl ${activeTab === AppTab.Profile ? 'bg-indigo-100' : ''}`}>
            <i className="fas fa-user-circle text-xl"></i>
          </div>
          <span className="text-[10px] font-bold">حسابي</span>
        </button>
      </nav>
      
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
