
import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt) return;
    setLoading(true);
    
    // Extract base64 and mimeType
    const matches = sourceImage.match(/^data:(image\/\w+);base64,(.+)$/);
    if (matches) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const result = await editImageWithGemini(base64Data, prompt, mimeType);
      if (result) setEditedImage(result);
      else alert("عذراً، لم أستطع تعديل الصورة.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="bg-white shadow-xl rounded-3xl w-full p-8 border-t-8 border-pink-400">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">محرر الصور الذكي</h2>
        <p className="text-pink-500 text-center mb-8 font-medium italic">"حوّل خيالك لواقع بضغطة زر"</p>

        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-3xl p-6 bg-gray-50 min-h-[300px] relative overflow-hidden">
            {!sourceImage && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center text-gray-400 hover:text-pink-500 transition-colors"
              >
                <i className="fas fa-cloud-upload-alt text-6xl mb-4"></i>
                <span className="text-lg font-bold">اضغط لرفع صورة</span>
              </button>
            )}

            {sourceImage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase text-center">الأصل</p>
                  <img src={sourceImage} alt="Original" className="rounded-2xl max-h-64 mx-auto object-contain shadow-md" />
                </div>
                {editedImage && (
                  <div className="space-y-2 animate-fadeIn">
                    <p className="text-xs font-bold text-pink-500 uppercase text-center">النتيجة</p>
                    <img src={editedImage} alt="Edited" className="rounded-2xl max-h-64 mx-auto object-contain shadow-md border-2 border-pink-200" />
                  </div>
                )}
                {!editedImage && loading && (
                  <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
                    <p className="mt-4 text-pink-500 font-medium">جاري معالجة الصورة...</p>
                  </div>
                )}
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-600 block px-1">ماذا تريد أن تفعل بالصورة؟</label>
            <input 
              type="text"
              placeholder="مثال: أضف فلتر قديم، أزل الخلفية، أضف قطة بجانبي..."
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-pink-400 transition-all text-gray-800"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="flex gap-4">
             <button
                disabled={!sourceImage || !prompt || loading}
                onClick={handleEdit}
                className="flex-1 py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري العمل...' : 'تعديل الصورة'}
              </button>
              {sourceImage && (
                <button
                  onClick={() => { setSourceImage(null); setEditedImage(null); setPrompt(''); }}
                  className="px-6 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
