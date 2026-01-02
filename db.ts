
import { AppState, User, Faculty, Major, Subject, FileItem } from './types';

const DB_KEY = 'edufiles_db_v1';

const initialState: AppState = {
  users: [
    { id: '1', name: 'المدير العام', username: 'abod', role: 'admin', password: '123' }
  ],
  faculties: [
    { id: 'f1', name: 'كلية الهندسة' },
    { id: 'f2', name: 'كلية الطب' },
    { id: 'f3', name: 'كلية الحاسبات' }
  ],
  majors: [
    { id: 'm1', facultyId: 'f1', name: 'الهندسة المدنية' },
    { id: 'm2', facultyId: 'f1', name: 'الهندسة المعمارية' },
    { id: 'm3', facultyId: 'f3', name: 'علوم الحاسوب' }
  ],
  subjects: [
    { id: 's1', majorId: 'm3', name: 'خوارزميات' },
    { id: 's2', majorId: 'm3', name: 'قواعد بيانات' }
  ],
  files: []
};

export const loadDB = (): AppState => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    saveDB(initialState);
    return initialState;
  }
  return JSON.parse(data);
};

export const saveDB = (state: AppState) => {
  localStorage.setItem(DB_KEY, JSON.stringify(state));
};

export const addUser = (user: User) => {
  const db = loadDB();
  db.users.push(user);
  saveDB(db);
};

export const addFaculty = (name: string) => {
  const db = loadDB();
  const id = 'f' + Date.now();
  db.faculties.push({ id, name });
  saveDB(db);
};

export const addMajor = (facultyId: string, name: string) => {
  const db = loadDB();
  const id = 'm' + Date.now();
  db.majors.push({ id, facultyId, name });
  saveDB(db);
};

export const addSubject = (majorId: string, name: string) => {
  const db = loadDB();
  const id = 's' + Date.now();
  db.subjects.push({ id, majorId, name });
  saveDB(db);
};

export const addFile = (file: Omit<FileItem, 'id' | 'uploadedAt'>) => {
  const db = loadDB();
  const newFile: FileItem = {
    ...file,
    id: 'file' + Date.now(),
    uploadedAt: new Date().toISOString()
  };
  db.files.push(newFile);
  saveDB(db);
};

export const deleteFile = (id: string) => {
  const db = loadDB();
  db.files = db.files.filter(f => f.id !== id);
  saveDB(db);
};
