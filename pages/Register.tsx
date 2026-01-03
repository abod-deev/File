
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
      setError('اسم المستخدم موجود مسبقاً');
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
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">إنشاء حساب جديد</h2>
          <p className="text-gray-500 mt-2">انضم إلينا الآن للوصول لكافة الملفات</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
            <div className="relative">
              <UserIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="اختر اسم مستخدم فريد"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition"
          >
            تسجيل
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          لديك حساب بالفعل؟ <Link to="/login" className="text-indigo-600 font-bold hover:underline">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
