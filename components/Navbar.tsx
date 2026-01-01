
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
              <BookOpen className="w-8 h-8" />
              <span className="hidden sm:inline">إيدو فايلز</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    لوحة التحكم
                  </Link>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 font-medium text-sm">تسجيل الدخول</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">إنشاء حساب</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
