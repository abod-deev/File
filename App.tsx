
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { loadDB, addUser } from './db';
import { User, AppState } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browsing from './pages/Browsing';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [db, setDb] = useState<AppState>(loadDB());
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edufiles_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('edufiles_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('edufiles_user');
  };

  // Sync DB on changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDb(loadDB());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<Home faculties={db.faculties} isLoggedIn={!!user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} users={db.users} />} />
          <Route path="/register" element={<Register onRegister={(u) => { addUser(u); handleLogin(u); }} users={db.users} />} />
          
          <Route path="/faculty/:facultyId" element={<Browsing isLoggedIn={!!user} />} />
          <Route path="/faculty/:facultyId/major/:majorId" element={<Browsing isLoggedIn={!!user} />} />
          <Route path="/faculty/:facultyId/major/:majorId/subject/:subjectId" element={<Browsing isLoggedIn={!!user} />} />

          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Routes>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-200 py-8 bg-white text-center">
          <p className="text-gray-500 text-sm">© 2024 إيدو فايلز - منصة الملفات الدراسية. جميع الحقوق محفوظة.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
