
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Folder, FileText, ExternalLink, Clock, BookOpen, ChevronLeft } from 'lucide-react';
import { loadDB } from '../db';
import { Major, Subject, FileItem, Faculty } from '../types';

interface BrowsingProps {
  isLoggedIn: boolean;
}

const Browsing: React.FC<BrowsingProps> = ({ isLoggedIn }) => {
  const { facultyId, majorId, subjectId } = useParams();
  const db = loadDB();
  
  const faculty = db.faculties.find(f => f.id === facultyId);
  const majors = db.majors.filter(m => m.facultyId === facultyId);
  const major = db.majors.find(m => m.id === majorId);
  const subjects = db.subjects.filter(s => s.majorId === majorId);
  const subject = db.subjects.find(s => s.id === subjectId);
  const files = db.files.filter(f => f.subjectId === subjectId);

  if (subjectId) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs faculty={faculty} major={major} subject={subject} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            الملفات الدراسية لـ {subject?.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.length > 0 ? files.map(file => (
              <FileCard key={file.id} file={file} isLoggedIn={isLoggedIn} />
            )) : (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 italic">لا توجد ملفات مرفوعة لهذه المادة حالياً.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (majorId) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs faculty={faculty} major={major} />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(s => (
            <Link 
              key={s.id} 
              to={`/faculty/${facultyId}/major/${majorId}/subject/${s.id}`}
              className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-800 text-lg">{s.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs faculty={faculty} />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {majors.map(m => (
          <Link 
            key={m.id} 
            to={`/faculty/${facultyId}/major/${m.id}`}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
                <Folder className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-lg">{m.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Breadcrumbs: React.FC<{ faculty?: Faculty; major?: Major; subject?: Subject }> = ({ faculty, major, subject }) => (
  <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-white p-3 px-5 rounded-xl border border-gray-100 overflow-x-auto whitespace-nowrap">
    <Link to="/" className="hover:text-indigo-600">الرئيسية</Link>
    <ChevronLeft className="w-4 h-4" />
    <Link to={`/faculty/${faculty?.id}`} className={`hover:text-indigo-600 ${!major ? 'font-bold text-gray-900' : ''}`}>{faculty?.name}</Link>
    {major && (
      <>
        <ChevronLeft className="w-4 h-4" />
        <Link to={`/faculty/${faculty?.id}/major/${major.id}`} className={`hover:text-indigo-600 ${!subject ? 'font-bold text-gray-900' : ''}`}>{major.name}</Link>
      </>
    )}
    {subject && (
      <>
        <ChevronLeft className="w-4 h-4" />
        <span className="font-bold text-gray-900">{subject.name}</span>
      </>
    )}
  </nav>
);

const FileCard: React.FC<{ file: FileItem; isLoggedIn: boolean }> = ({ file, isLoggedIn }) => {
  const handleOpenLink = () => {
    if (!isLoggedIn) return;
    // فتح الرابط في نافذة جديدة
    window.open(file.url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            file.category === 'كتاب' ? 'bg-blue-50 text-blue-600' :
            file.category === 'ملخص' ? 'bg-green-50 text-green-600' :
            file.category === 'ملزمة' ? 'bg-purple-50 text-purple-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            {file.category}
          </span>
          <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> رابط خارجي
          </span>
        </div>
        <h4 className="font-bold text-gray-800 mb-3 text-lg leading-snug group-hover:text-indigo-600 transition">{file.name}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(file.uploadedAt).toLocaleDateString('ar-EG')}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleOpenLink}
        disabled={!isLoggedIn}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
          isLoggedIn 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <ExternalLink className="w-5 h-5" />
        {isLoggedIn ? 'فتح وتحميل الملف' : 'سجل الدخول للتحميل'}
      </button>
    </div>
  );
};

export default Browsing;
