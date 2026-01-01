
import React, { useState } from 'react';
import { Plus, Trash2, LayoutGrid, FilePlus, Link as LinkIcon, AlertCircle, Download, Upload, Database } from 'lucide-react';
import { loadDB, addFaculty, addMajor, addSubject, addFile, deleteFile, getRawDB, importRawDB } from '../db';
import { AppState, FileCategory } from '../types';

const AdminDashboard: React.FC = () => {
  const [db, setDb] = useState<AppState>(loadDB());
  const [activeTab, setActiveTab] = useState<'faculties' | 'files' | 'backup'>('faculties');

  // Form states
  const [newFaculty, setNewFaculty] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [newMajor, setNewMajor] = useState('');
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [newSubject, setNewSubject] = useState('');

  // File states
  const [fileData, setFileData] = useState({
    name: '',
    facultyId: '',
    majorId: '',
    subjectId: '',
    category: 'ملخص' as FileCategory,
    url: ''
  });

  const refresh = () => setDb(loadDB());

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty) return;
    addFaculty(newFaculty);
    setNewFaculty('');
    refresh();
  };

  const handleExportDB = () => {
    const data = getRawDB();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edufiles_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importRawDB(content)) {
          alert('تم استيراد قاعدة البيانات بنجاح!');
          refresh();
        } else {
          alert('فشل الاستيراد، يرجى التأكد من صحة الملف');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddMajor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacultyId || !newMajor) return;
    addMajor(selectedFacultyId, newMajor);
    setNewMajor('');
    refresh();
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMajorId || !newSubject) return;
    addSubject(selectedMajorId, newSubject);
    setNewSubject('');
    refresh();
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData.name || !fileData.subjectId || !fileData.url) {
      alert('يرجى تعبئة كافة الحقول ووضع رابط الملف');
      return;
    }
    if (!fileData.url.startsWith('http')) {
      alert('الرابط يجب أن يبدأ بـ http أو https');
      return;
    }

    addFile({
      name: fileData.name,
      subjectId: fileData.subjectId,
      category: fileData.category,
      type: 'رابط',
      size: '--',
      url: fileData.url
    });

    setFileData({ ...fileData, name: '', url: '' });
    refresh();
    alert('تمت إضافة الملف بنجاح!');
  };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <button 
          onClick={() => setActiveTab('faculties')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'faculties' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
        >
          <LayoutGrid className="w-5 h-5" />
          تنظيم الهيكل
        </button>
        <button 
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'files' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
        >
          <FilePlus className="w-5 h-5" />
          إدارة الملفات
        </button>
        <button 
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'backup' ? 'bg-amber-600 text-white shadow-xl shadow-amber-100' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
        >
          <Database className="w-5 h-5" />
          النسخ الاحتياطي
        </button>
      </div>

      {activeTab === 'faculties' && (
        <div className="grid grid-cols-1 gap-8 text-right">
          {/* Faculty */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">إضافة كلية</h2>
            <form onSubmit={handleAddFaculty} className="flex gap-4">
              <input 
                type="text" 
                value={newFaculty} 
                onChange={e => setNewFaculty(e.target.value)}
                placeholder="اسم الكلية..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-50">
                <Plus className="w-5 h-5" /> إضافة
              </button>
            </form>
          </section>

          {/* Major */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">إضافة تخصص جديد</h2>
            <form onSubmit={handleAddMajor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                value={selectedFacultyId} 
                onChange={e => setSelectedFacultyId(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none"
              >
                <option value="">اختر الكلية</option>
                {db.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <input 
                type="text" 
                value={newMajor} 
                onChange={e => setNewMajor(e.target.value)}
                placeholder="اسم التخصص..." 
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                إضافة
              </button>
            </form>
          </section>

          {/* Subject */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">إضافة مادة دراسية</h2>
            <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                value={selectedMajorId} 
                onChange={e => setSelectedMajorId(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none"
              >
                <option value="">اختر التخصص</option>
                {db.majors.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({db.faculties.find(f => f.id === m.facultyId)?.name})
                  </option>
                ))}
              </select>
              <input 
                type="text" 
                value={newSubject} 
                onChange={e => setNewSubject(e.target.value)}
                placeholder="اسم المادة..." 
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                إضافة
              </button>
            </form>
          </section>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="space-y-10 text-right">
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-8">إدراج رابط ملف جديد</h2>
            <form onSubmit={handleAddFile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">الكلية</label>
                <select 
                  value={fileData.facultyId} 
                  onChange={e => setFileData({...fileData, facultyId: e.target.value, majorId: '', subjectId: ''})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none"
                >
                  <option value="">-- اختر الكلية --</option>
                  {db.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">التخصص</label>
                <select 
                  disabled={!fileData.facultyId}
                  value={fileData.majorId} 
                  onChange={e => setFileData({...fileData, majorId: e.target.value, subjectId: ''})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none disabled:opacity-40"
                >
                  <option value="">-- اختر التخصص --</option>
                  {db.majors.filter(m => m.facultyId === fileData.facultyId).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">المادة</label>
                <select 
                  disabled={!fileData.majorId}
                  value={fileData.subjectId} 
                  onChange={e => setFileData({...fileData, subjectId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none disabled:opacity-40"
                >
                  <option value="">-- اختر المادة --</option>
                  {db.subjects.filter(s => s.majorId === fileData.majorId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">اسم الملف</label>
                <input 
                  type="text" 
                  value={fileData.name} 
                  onChange={e => setFileData({...fileData, name: e.target.value})}
                  placeholder="مثال: ملزمة مادة التشريح" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">رابط الملف</label>
                <input 
                  type="url" 
                  value={fileData.url}
                  onChange={e => setFileData({...fileData, url: e.target.value})}
                  placeholder="https://drive.google.com/..." 
                  className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 outline-none font-mono text-sm"
                />
              </div>
              <button type="submit" className="md:col-span-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg">
                حفظ الملف
              </button>
            </form>
          </section>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-10 text-right">
          <section className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">النسخ الاحتياطي واستعادة البيانات</h2>
            <p className="text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
              يمكنك تصدير كل بيانات الموقع (المستخدمين، الكليات، الروابط) في ملف JSON واحد للحتفاظ به أو لنقله لجهاز آخر.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Export */}
              <button 
                onClick={handleExportDB}
                className="flex flex-col items-center justify-center gap-4 p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] hover:bg-indigo-100 transition-all group"
              >
                <div className="p-4 bg-white text-indigo-600 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <Download className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <span className="block font-extrabold text-indigo-900 text-lg">تصدير البيانات</span>
                  <span className="text-sm text-indigo-600">تحميل ملف db.json الحالي</span>
                </div>
              </button>

              {/* Import */}
              <label className="flex flex-col items-center justify-center gap-4 p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] hover:bg-emerald-100 transition-all group cursor-pointer">
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportDB}
                  className="hidden" 
                />
                <div className="p-4 bg-white text-emerald-600 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <span className="block font-extrabold text-emerald-900 text-lg">استيراد البيانات</span>
                  <span className="text-sm text-emerald-600">رفع ملف db.json خارجي</span>
                </div>
              </label>
            </div>

            <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-right">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-red-900 mb-1">تنبيه هام جداً</h4>
                <p className="text-sm text-red-700 leading-relaxed">
                  عند قيامك بعملية "استيراد"، سيتم مسح كافة البيانات الحالية في المتصفح واستبدالها بمحتويات الملف المرفوع. يرجى التأكد من أنك ترفع الملف الصحيح.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
