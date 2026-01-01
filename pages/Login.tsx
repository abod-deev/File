
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { LogIn, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      onLogin(foundUser);
      navigate('/');
    } else {
      setError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 rotate-3 group-hover:rotate-0 transition-transform">
            <LogIn className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">أهلاً بك مجدداً</h2>
          <p className="text-gray-500 mt-3">سجل دخولك لتتمكن من الوصول لملفاتك</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-1">اسم المستخدم</label>
            <div className="relative">
              <UserIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                placeholder="أدخل اسم المستخدم"
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98] transition-all"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          ليس لديك حساب؟ <Link to="/register" className="text-indigo-600 font-bold hover:underline">سجل كطالب جديد</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
