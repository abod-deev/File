
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { UserPlus, User as UserIcon, Lock, Mail, AlertCircle } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User) => void;
  users: User[];
}

const Register: React.FC<RegisterProps> = ({ onRegister, users }) => {
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.some(u => u.username === formData.username)) {
      setError('اسم المستخدم هذا مستخدم بالفعل، اختر اسماً آخر');
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      role: 'student'
    };
    onRegister(newUser);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-50">
            <UserPlus className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">انضم إلينا</h2>
          <p className="text-gray-500 mt-3">أنشئ حسابك للبدء في تحميل المحتوى</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-1">الاسم الكامل</label>
            <div className="relative">
              <UserIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                placeholder="مثال: أحمد محمد"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-1">اسم المستخدم</label>
            <div className="relative">
              <Mail className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                placeholder="اختر اسم مستخدم فريد"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            إنشاء الحساب
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          لديك حساب بالفعل؟ <Link to="/login" className="text-indigo-600 font-bold hover:underline">سجل دخولك</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
