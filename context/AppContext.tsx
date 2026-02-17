
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Professional, ServiceRequest, AppState, ServiceStatus } from '../types';

interface AppContextType extends AppState {
  login: (user: User | Professional) => void;
  logout: () => void;
  registerUser: (user: User | Professional) => void;
  updateUser: (user: User | Professional) => void;
  createRequest: (request: ServiceRequest) => void;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => void;
  verifyProfessional: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | Professional | null>(() => {
    const saved = localStorage.getItem('mao_obra_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<(User | Professional)[]>(() => {
    const saved = localStorage.getItem('mao_obra_all_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('mao_obra_requests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mao_obra_user', JSON.stringify(currentUser));
    localStorage.setItem('mao_obra_all_users', JSON.stringify(allUsers));
    localStorage.setItem('mao_obra_requests', JSON.stringify(requests));
  }, [currentUser, allUsers, requests]);

  const login = (user: User | Professional) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const registerUser = (user: User | Professional) => {
    setAllUsers(prev => [...prev, user]);
    login(user);
  };

  const updateUser = (updatedUser: User | Professional) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
  };

  const createRequest = (req: ServiceRequest) => setRequests(prev => [req, ...prev]);

  const updateRequest = (id: string, updates: Partial<ServiceRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const verifyProfessional = (id: string) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: true } : u));
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, allUsers, requests, 
      login, logout, registerUser, updateUser, 
      createRequest, updateRequest, verifyProfessional 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
