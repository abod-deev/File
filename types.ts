
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  password?: string;
}

export interface Faculty {
  id: string;
  name: string;
}

export interface Major {
  id: string;
  facultyId: string;
  name: string;
}

export interface Subject {
  id: string;
  majorId: string;
  name: string;
}

export type FileCategory = 'ملخص' | 'ملزمة' | 'كتاب' | 'مرجع';

export interface FileItem {
  id: string;
  name: string;
  subjectId: string;
  category: FileCategory;
  type: string;
  size: string;
  uploadedAt: string;
  url: string; 
}

export interface AppState {
  users: User[];
  faculties: Faculty[];
  majors: Major[];
  subjects: Subject[];
  files: FileItem[];
}
