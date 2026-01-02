
import React, { useState } from 'react';
import { Plus, Trash2, LayoutGrid, FilePlus, Link as LinkIcon } from 'lucide-react';
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
    url: '', // رابط الملف (جوجل درايف)
    type: 'link', // نوع الملف سيكون رابط
    size: 'خارجي' // الحجم غير معروف لأنه خارجي
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
    
    // التحقق البسيط من الرابط
    if (!fileData.url.startsWith('http')) {
      alert('يرجى إدخال رابط صحيح يبدأ بـ http أو https');
      return;
    }

    addFile({
      name: fileData.name,
      subjectId: fileData.subjectId,
      category: fileData.category,
      type: 'رابط',
      size: '-- MB',
      url: fileData.url
    });

    setFileData({
      name: '',
      facultyId: '',
      majorId: '',
      subjectId: '',
      category: 'ملخص',
      url: '',
      type: 'رابط',
      size: '-- MB'
    });
    
    refresh();
    alert('تمت إضافة رابط الملف بنجاح!');
  };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8 text-right">
        <button 
          onClick={() => setActiveTab('faculties')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition ${activeTab === 'faculties' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          <LayoutGrid className="w-5 h-5" />
          الهيكل الدراسي
        </button>
        <button 
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition ${activeTab === 'files' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          <FilePlus className="w-5 h-5" />
          إدارة الملفات
        </button>
      </div>

      {activeTab === 'faculties' ? (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">إضافة كلية</h2>
            <form onSubmit={handleAddFaculty} className="flex gap-4">
              <input 
                type="text" 
                value={newFaculty} 
                onChange={e => setNewFaculty(e.target.value)}
                placeholder="اسم الكلية..." 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700">
                <Plus className="w-5 h-5" /> إضافة
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">إضافة تخصص</h2>
            <form onSubmit={handleAddMajor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                value={selectedFacultyId} 
                onChange={e => setSelectedFacultyId(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
              >
                <option value="">اختر الكلية</option>
                {db.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <input 
                type="text" 
                value={newMajor} 
                onChange={e => setNewMajor(e.target.value)}
                placeholder="اسم التخصص..." 
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                <Plus className="w-5 h-5" /> إضافة
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">إضافة مادة</h2>
            <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                value={selectedMajorId} 
                onChange={e => setSelectedMajorId(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
              >
                <option value="">اختر التخصص</option>
                {db.majors.map(m => <option key={m.id} value={m.id}>{m.name} ({db.faculties.find(f => f.id === m.facultyId)?.name})</option>)}
              </select>
              <input 
                type="text" 
                value={newSubject} 
                onChange={e => setNewSubject(e.target.value)}
                placeholder="اسم المادة..." 
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                <Plus className="w-5 h-5" /> إضافة
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">إضافة ملف جديد (رابط خارجي)</h2>
            <form onSubmit={handleAddFile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">الكلية</label>
                <select 
                  value={fileData.facultyId} 
                  onChange={e => setFileData({...fileData, facultyId: e.target.value, majorId: '', subjectId: ''})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="">اختر الكلية</option>
                  {db.faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">التخصص</label>
                <select 
                  disabled={!fileData.facultyId}
                  value={fileData.majorId} 
                  onChange={e => setFileData({...fileData, majorId: e.target.value, subjectId: ''})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 disabled:opacity-50"
                >
                  <option value="">اختر التخصص</option>
                  {db.majors.filter(m => m.facultyId === fileData.facultyId).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">المادة</label>
                <select 
                  disabled={!fileData.majorId}
                  value={fileData.subjectId} 
                  onChange={e => setFileData({...fileData, subjectId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 disabled:opacity-50"
                >
                  <option value="">اختر المادة</option>
                  {db.subjects.filter(s => s.majorId === fileData.majorId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">نوع الملف</label>
                <select 
                  value={fileData.category} 
                  onChange={e => setFileData({...fileData, category: e.target.value as FileCategory})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option value="ملخص">ملخص</option>
                  <option value="ملزمة">ملزمة</option>
                  <option value="كتاب">كتاب</option>
                  <option value="مرجع">مرجع</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">اسم الملف المعروض للطلاب</label>
                <input 
                  type="text" 
                  value={fileData.name} 
                  onChange={e => setFileData({...fileData, name: e.target.value})}
                  placeholder="مثال: ملخص مادة الخوارزميات - الوحدة الأولى" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" /> رابط الملف (Google Drive, Dropbox, إلخ)
                </label>
                <input 
                  type="url" 
                  value={fileData.url}
                  onChange={e => setFileData({...fileData, url: e.target.value})}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full bg-gray-50 border border-indigo-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                  حفظ الملف
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">الملفات المضافة</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 font-bold text-gray-600">اسم الملف</th>
                    <th className="py-4 font-bold text-gray-600">التصنيف</th>
                    <th className="py-4 font-bold text-gray-600">المادة</th>
                    <th className="py-4 font-bold text-gray-600">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {db.files.map(file => (
                    <tr key={file.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 text-gray-800 font-medium">{file.name}</td>
                      <td className="py-4">
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">{file.category}</span>
                      </td>
                      <td className="py-4 text-gray-600 text-sm">
                        {db.subjects.find(s => s.id === file.subjectId)?.name || 'غير معروف'}
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => { deleteFile(file.id); refresh(); }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
