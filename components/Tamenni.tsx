
import React, { useState } from 'react';
import { generateHealthAdvice } from '../services/geminiService';

interface SymptomConfig {
  id: string;
  label: string;
  icon: string;
  questions: {
    id: string;
    label: string;
    options: string[];
  }[];
  tips: string[];
  warning: string;
}

const SYMPTOMS: Record<string, SymptomConfig> = {
  headache: {
    id: 'headache',
    label: 'صداع',
    icon: '🧠',
    questions: [
      { id: 'duration', label: 'مدة الصداع؟', options: ['ساعات', 'يوم', 'أكثر من يوم'] },
      { id: 'intensity', label: 'شدة الألم؟', options: ['خفيف', 'متوسط', 'شديد'] },
      { id: 'others', label: 'هل مع أعراض أخرى؟', options: ['نعم', 'لا'] },
    ],
    tips: ['اشرب ماء كافي 💧', 'خذ قسط راحة 🛌', 'تجنب الضوضاء والضوء الساطع'],
    warning: '🚨 راجع طبيب فورًا إذا الصداع شديد جدًا أو مستمر أكثر من يومين',
  },
  joints: {
    id: 'joints',
    label: 'ألم المفاصل',
    icon: '🦴',
    questions: [
      { id: 'swelling', label: 'هل يوجد تورم أو احمرار؟', options: ['نعم', 'لا'] },
      { id: 'stiffness', label: 'هل تشعر بتصلب صباحي؟', options: ['نعم', 'لا'] },
      { id: 'onset', label: 'منذ متى بدأ الألم؟', options: ['يوم', 'أسبوع', 'أكثر'] },
    ],
    tips: ['استخدام كمادات دافئة/باردة', 'تقليل الجهد البدني المجهد', 'تمارين تمدد خفيفة'],
    warning: '🚨 تورم شديد أو عدم القدرة على تحريك المفصل = راجع طبيب فورًا',
  },
  backPain: {
    id: 'backPain',
    label: 'ألم الظهر',
    icon: '🧘‍♂️',
    questions: [
      { id: 'location', label: 'مكان الألم؟', options: ['أعلى الظهر', 'أسفل الظهر', 'منتصف الظهر'] },
      { id: 'radiating', label: 'هل يمتد الألم إلى الساق؟', options: ['نعم', 'لا'] },
      { id: 'numbness', label: 'هل يوجد تنميل أو خدر؟', options: ['نعم', 'لا'] },
    ],
    tips: ['النوم على سطح مستوٍ ومريح', 'تجنب الجلوس الطويل بوضعية خاطئة', 'استخدام وسادة داعمة للظهر'],
    warning: '🚨 ألم مفاجئ شديد أو تنميل وفقدان الإحساس في الأطراف = راجع طبيب فورًا',
  },
  musclePain: {
    id: 'musclePain',
    label: 'ألم العضلات',
    icon: '💪',
    questions: [
      { id: 'cause', label: 'هل بسبب مجهود بدني مفاجئ؟', options: ['نعم', 'لا'] },
      { id: 'spread', label: 'هل الألم منتشر أم في عضلة محددة؟', options: ['منتشر', 'محدد'] },
      { id: 'cramps', label: 'هل يوجد تشنجات أو شد عضلي؟', options: ['نعم', 'لا'] },
    ],
    tips: ['التدليك الخفيف للمنطقة المصابة', 'شرب سوائل غنية بالمعادن (كالبوتاسيوم)', 'أخذ حمام دافئ للاسترخاء'],
    warning: '🚨 ألم عضلي شديد جداً لا يزول بالراحة أو تغير في لون البول = راجع طبيب فورًا',
  },
  fever: {
    id: 'fever',
    label: 'سخونة',
    icon: '🌡️',
    questions: [
      { id: 'temp', label: 'ما درجة الحرارة؟', options: ['أقل من 38', '38 - 39', 'أعلى من 39'] },
      { id: 'since', label: 'منذ متى الحرارة موجودة؟', options: ['ساعات', 'يوم', 'أكثر'] },
      { id: 'others', label: 'هل مع أعراض أخرى؟', options: ['نعم', 'لا'] },
    ],
    tips: ['اشرب سوائل دافئة', 'استرح في مكان بارد', 'راقب درجة الحرارة'],
    warning: '🚨 حرارة > 39° = راجع طبيب فورًا',
  },
  stomach: {
    id: 'stomach',
    label: 'ألم بطن',
    icon: '🤰',
    questions: [
      { id: 'location', label: 'مكان الألم؟', options: ['أعلى', 'أسفل', 'جانبي'] },
      { id: 'duration', label: 'مدة الألم؟', options: ['ساعات', 'يوم', 'أكثر'] },
      { id: 'digestion', label: 'هل مع غثيان أو إسهال؟', options: ['نعم', 'لا'] },
    ],
    tips: ['اشرب ماء دافئ', 'تجنب الأطعمة الدسمة', 'استرح على الظهر'],
    warning: '🚨 ألم شديد أو مستمر = راجع طبيب فورًا',
  },
  cold: {
    id: 'cold',
    label: 'سعال وزكام',
    icon: '🤧',
    questions: [
      { id: 'type', label: 'نوع السعال؟', options: ['جاف', 'بلغم', 'زكام فقط'] },
      { id: 'duration', label: 'مدة الأعراض؟', options: ['أقل من 3 أيام', 'أسبوع', 'أكثر'] },
      { id: 'breathing', label: 'هل يوجد صعوبة تنفس؟', options: ['نعم', 'لا'] },
    ],
    tips: ['شرب العسل والليمون 🍯', 'الغرغرة بماء وملح', 'ترطيب الجسم باستمرار'],
    warning: '🚨 كحة مستمرة لأكثر من أسبوع أو بلغم مدمم = طبيب فوراً',
  },
  stress: {
    id: 'stress',
    label: 'إجهاد وتعب',
    icon: '😴',
    questions: [
      { id: 'sleep', label: 'كم ساعة نمت؟', options: ['أقل من 5', '5 - 7', 'أكثر من 8'] },
      { id: 'work', label: 'هل ضغط العمل عالي؟', options: ['نعم', 'لا'] },
      { id: 'physical', label: 'هل تشعر بآلام عضلية؟', options: ['نعم', 'لا'] },
    ],
    tips: ['نظم وقت النوم', 'مارس تمارين التنفس', 'قلل الكافيين في المساء'],
    warning: '🚨 تعب مزمن غير مفسر أو ألم صدر = راجع طبيب',
  }
};

const Tamenni: React.FC = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const currentSymptomData = selectedSymptom ? SYMPTOMS[selectedSymptom] : null;

  const handleSymptomSelect = (id: string) => {
    setSelectedSymptom(id);
    setCurrentStep(0);
    setAnswers({});
  };

  const handleAnswer = (answer: string) => {
    if (!currentSymptomData) return;
    const q = currentSymptomData.questions[currentStep];
    const newAnswers = { ...answers, [q.id]: answer };
    setAnswers(newAnswers);

    if (currentStep < currentSymptomData.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      processHealthResult(newAnswers);
    }
  };

  const processHealthResult = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    const details = Object.entries(finalAnswers).map(([k, v]) => `${k}: ${v}`).join(', ');
    const aiAdvice = await generateHealthAdvice(`${currentSymptomData?.label} (${selectedSymptom})`, details);
    setAdvice(aiAdvice);
    setLoading(false);
  };

  const reset = () => {
    setSelectedSymptom(null);
    setCurrentStep(0);
    setAnswers({});
    setAdvice(null);
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-4 animate-fadeIn">
      <div className="bg-white shadow-xl rounded-3xl w-full p-8 border-t-8 border-blue-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fas fa-stethoscope text-6xl text-blue-500"></i>
        </div>

        <div className="text-center mb-8 relative z-10">
          <div className="bg-pink-100 text-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner cursor-pointer hover:scale-105 transition-transform" onClick={reset}>
            <i className="fas fa-heart"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">طمني | Tamenni</h1>
          <p className="text-blue-500 font-medium">مساعدك الصحي الذكي 💖</p>
        </div>

        {/* Step 1: Select Symptom */}
        {!selectedSymptom && !loading && !advice && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-700 text-center mb-4">بماذا تشعر اليوم؟</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.values(SYMPTOMS).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSymptomSelect(s.id)}
                  className="flex flex-col items-center p-6 bg-white border-2 border-gray-50 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm active:scale-95 group"
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className="font-bold text-gray-700 text-center leading-tight">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Answer Questions */}
        {selectedSymptom && !advice && !loading && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setSelectedSymptom(null)} className="text-gray-400 hover:text-blue-500">
                    <i className="fas fa-arrow-right"></i>
                </button>
                <div className="flex-1 h-1 bg-gray-100 rounded-full">
                    <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                        style={{ width: `${((currentStep + 1) / currentSymptomData!.questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
              <span className="text-3xl">{currentSymptomData?.icon}</span>
              <p className="text-lg text-gray-800 font-bold">{currentSymptomData?.questions[currentStep].label}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentSymptomData?.questions[currentStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full py-5 px-6 text-right bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all font-bold text-gray-800 shadow-sm active:scale-95"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">أنا هنا بجانبك... أقوم بتحليل الأعراض...</p>
          </div>
        )}

        {/* Results/Advice State */}
        {advice && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 whitespace-pre-wrap text-gray-800 leading-relaxed shadow-inner">
              {advice}
            </div>
            
            <div className="space-y-4">
                <div className="bg-blue-50 p-5 rounded-xl border-r-8 border-blue-400">
                    <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                        <i className="fas fa-lightbulb"></i>
                        نصائح سريعة:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 pr-2">
                        {currentSymptomData?.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-red-50 p-5 rounded-xl border-r-8 border-red-400">
                    <h3 className="font-bold text-red-700 mb-1 flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        تنبيه:
                    </h3>
                    <p className="text-gray-700 font-medium">{currentSymptomData?.warning}</p>
                </div>
            </div>

            <button 
              onClick={reset}
              className="w-full py-5 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
            >
              بدء فحص جديد
            </button>
          </div>
        )}

        {/* Credit Section */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-1">تم التطوير تحت إشراف</p>
          <p className="text-sm font-bold text-gray-700">دكتورة المستقبل Dr. NWAIF NAIF Al-Yami</p>
        </div>
      </div>
    </div>
  );
};

export default Tamenni;
