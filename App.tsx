
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Landing from './views/Landing';
import Register from './views/Register';
import ClientDashboard from './views/ClientDashboard';
import ProDashboard from './views/ProDashboard';
import AdminDashboard from './views/AdminDashboard';
import { Button, Input } from './components/Common';

// Login view integrated here for simplicity in MVP
const LoginView: React.FC = () => {
  const { allUsers, login } = useApp();
  const [email, setEmail] = React.useState('');
  const navigate = React.useNavigate();

  const handleLogin = () => {
    const user = allUsers.find(u => u.email === email);
    if (user) {
      login(user);
      if (user.role === 'CLIENTE') navigate('/dashboard/cliente');
      else if (user.role === 'PROFISSIONAL') navigate('/dashboard/profissional');
      else navigate('/dashboard/admin');
    } else if (email === 'admin@app.com') {
      // Hardcoded Admin for demo
      const admin = { id: 'admin-1', name: 'Administrador', email: 'admin@app.com', role: 'ADMIN' as const, isVerified: true, wallet: 0, cpf: '', address: '', phone: '' };
      login(admin);
      navigate('/dashboard/admin');
    } else {
      alert("Usuário não encontrado. Use o email cadastrado ou 'admin@app.com'.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-bold mb-6 text-center">Entrar no Mãos à Obra</h2>
        <Input label="Seu Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" className="mb-6" />
        <Button onClick={handleLogin} className="w-full !py-3">Acessar Plataforma</Button>
        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem conta? <span onClick={() => navigate('/register')} className="text-blue-600 font-bold cursor-pointer hover:underline">Cadastre-se</span>
        </p>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginView />} />
        <Route 
          path="/dashboard/cliente" 
          element={<ProtectedRoute allowedRoles={['CLIENTE']}><ClientDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/dashboard/profissional" 
          element={<ProtectedRoute allowedRoles={['PROFISSIONAL']}><ProDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/dashboard/admin" 
          element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
