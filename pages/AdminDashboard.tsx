
import React, { useState } from 'react';
import { Plus, Trash2, LayoutGrid, FilePlus, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { loadDB, addFaculty, addMajor, addSubject, addFile, deleteFile } from '../db';
import { AppState, FileCategory } from '../types';

const AdminDashboard: React.FC = () => {
  const [db, setDb] = useState<AppState>(loadDB());
  const [activeTab, setActiveTab] = useState<'faculties' | 'files'>('faculties');

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
          إدارة الملفات والروابط
        </button>
      </div>

      {activeTab === 'faculties' ? (
        <div className="grid grid-cols-1 gap-8">
          {/* Faculty */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">إضافة كلية</h2>
            <form onSubmit={handleAddFaculty} className="flex gap-4">
              <input 
                type="text" 
                value={newFaculty} 
                onChange={e => setNewFaculty(e.target.value)}
                placeholder="اسم الكلية (مثلاً: كلية الحقوق)" 
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
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-50">
                <Plus className="w-5 h-5" /> إضافة
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
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-50">
                <Plus className="w-5 h-5" /> إضافة
              </button>
            </form>
          </section>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Add File Link */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <FilePlus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">إدراج رابط ملف جديد</h2>
            </div>
            
            <form onSubmit={handleAddFile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">1. الكلية</label>
                <select 
                  value={fileData.facultyId} 
                  onChange={e => setFileData({...fileData, facultyId: e.target.value, majorId: '', subjectId: ''})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- اختر الكلية --</option>
                  {db.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">2. التخصص</label>
                <select 
                  disabled={!fileData.facultyId}
                  value={fileData.majorId} 
                  onChange={e => setFileData({...fileData, majorId: e.target.value, subjectId: ''})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-40"
                >
                  <option value="">-- اختر التخصص --</option>
                  {db.majors.filter(m => m.facultyId === fileData.facultyId).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">3. المادة</label>
                <select 
                  disabled={!fileData.majorId}
                  value={fileData.subjectId} 
                  onChange={e => setFileData({...fileData, subjectId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-40"
                >
                  <option value="">-- اختر المادة --</option>
                  {db.subjects.filter(s => s.majorId === fileData.majorId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">4. نوع الملف</label>
                <select 
                  value={fileData.category} 
                  onChange={e => setFileData({...fileData, category: e.target.value as FileCategory})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="ملخص">ملخص</option>
                  <option value="ملزمة">ملزمة</option>
                  <option value="كتاب">كتاب</option>
                  <option value="مرجع">مرجع</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2">5. اسم الملف الظاهر للطلاب</label>
                <input 
                  type="text" 
                  value={fileData.name} 
                  onChange={e => setFileData({...fileData, name: e.target.value})}
                  placeholder="مثال: ملزمة مادة التشريح - الجزء الأول" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-600 mr-2 flex items-center gap-1">
                  <LinkIcon className="w-4 h-4 text-indigo-500" /> 6. رابط جوجل درايف (Drive Link)
                </label>
                <input 
                  type="url" 
                  value={fileData.url}
                  onChange={e => setFileData({...fileData, url: e.target.value})}
                  placeholder="ضع الرابط هنا (https://drive.google.com/...)" 
                  className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                />
              </div>

              <button type="submit" className="md:col-span-2 py-4 bg-indigo-600 text-white font-extrabold text-lg rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-[0.99] transition-all">
                اعتماد وحفظ الملف في النظام
              </button>
            </form>
          </section>

          {/* Manage Existing Files */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              الملفات الحالية في النظام
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-bold text-gray-600 rounded-r-2xl">الملف</th>
                    <th className="p-4 font-bold text-gray-600">التصنيف</th>
                    <th className="p-4 font-bold text-gray-600">المادة</th>
                    <th className="p-4 font-bold text-gray-600 rounded-l-2xl text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {db.files.length > 0 ? db.files.map(file => (
                    <tr key={file.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{file.name}</td>
                      <td className="p-4">
                        <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-bold">{file.category}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {db.subjects.find(s => s.id === file.subjectId)?.name}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => { if(confirm('متأكد؟')){ deleteFile(file.id); refresh(); } }}
                          className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400 italic">لا توجد ملفات بعد.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
