
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ChevronLeft } from 'lucide-react';
import { Faculty } from '../types';

interface HomeProps {
  faculties: Faculty[];
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ faculties, isLoggedIn }) => {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">مرحباً بك في إيدو فايلز</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">المكان الموثوق لتحميل الملازم والمراجع الدراسية لكافة التخصصات الجامعية.</p>
        {!isLoggedIn && (
          <div className="mt-8 p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 inline-block">
            يرجى <Link to="/login" className="font-bold underline">تسجيل الدخول</Link> لتتمكن من الوصول لروابط التحميل.
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <GraduationCap className="w-7 h-7 text-indigo-600" />
        اختر الكلية
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties.map((faculty) => (
          <Link 
            key={faculty.id} 
            to={`/faculty/${faculty.id}`}
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700">{faculty.name}</h3>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
