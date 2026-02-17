
import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_NAME } from '../constants.tsx';
import { Button } from './Common';
import { useNavigate } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <i className="fas fa-hammer"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{APP_NAME}</h1>
        </div>

        <nav className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase">{currentUser.role}</p>
                <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
              </div>
              <img 
                src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} 
                className="w-10 h-10 rounded-full border-2 border-blue-100" 
                alt="Avatar"
              />
              <Button variant="secondary" onClick={() => { logout(); navigate('/'); }} className="!px-3 !py-2">
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/login')}>Entrar</Button>
              <Button onClick={() => navigate('/register')}>Criar Conta</Button>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <i className="fas fa-hammer text-blue-500"></i>
            <span className="font-bold text-white">{APP_NAME}</span>
          </div>
          <p className="text-sm">&copy; 2024 {APP_NAME}. Conectando talentos à sua obra.</p>
          <div className="flex gap-4 text-xl">
            <i className="fab fa-instagram hover:text-white cursor-pointer"></i>
            <i className="fab fa-whatsapp hover:text-white cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
