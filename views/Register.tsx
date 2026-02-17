
import React, { useState } from 'react';
import { Button, Card, Input } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES } from '../constants.tsx';
import { UserRole, User, Professional } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useApp();
  const [role, setRole] = useState<UserRole>('CLIENTE');
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    category: SERVICE_CATEGORIES[0],
    pricePerHour: 0,
    bio: ''
  });

  const handleRegister = () => {
    const id = Math.random().toString(36).substr(2, 9);
    
    if (role === 'CLIENTE') {
      const newUser: User = {
        id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        cpf: form.cpf,
        address: form.address,
        role: 'CLIENTE',
        isVerified: true,
        wallet: 500 // Demo credit
      };
      registerUser(newUser);
      navigate('/dashboard/cliente');
    } else {
      const newPro: Professional = {
        id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        cpf: form.cpf,
        address: form.address,
        role: 'PROFISSIONAL',
        category: form.category,
        bio: form.bio,
        pricePerHour: form.pricePerHour,
        availability: "Segunda a Sexta, 8h - 18h",
        portfolio: [],
        rating: 0,
        reviewsCount: 0,
        isVerified: false, // Pros need admin approval
        wallet: 0
      };
      registerUser(newPro);
      navigate('/dashboard/profissional');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="p-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-6 text-center">
          {step === 1 ? "Como deseja usar o app?" : "Complete seu cadastro"}
        </h2>

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <div 
              onClick={() => setRole('CLIENTE')}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${role === 'CLIENTE' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${role === 'CLIENTE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <p className="font-bold text-lg">Sou Cliente</p>
                  <p className="text-sm text-slate-500">Quero contratar serviços para minha casa ou obra.</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setRole('PROFISSIONAL')}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${role === 'PROFISSIONAL' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${role === 'PROFISSIONAL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <i className="fas fa-tools"></i>
                </div>
                <div>
                  <p className="font-bold text-lg">Sou Profissional</p>
                  <p className="text-sm text-slate-500">Quero oferecer meus serviços e ganhar dinheiro.</p>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full mt-4 !py-4">Continuar</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Nome Completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="João da Silva" />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="joao@email.com" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Telefone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(11) 99999-9999" />
              <Input label="CPF/CNPJ" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} placeholder="000.000.000-00" />
            </div>
            <Input label="Endereço" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Rua das Obras, 123" />
            
            {role === 'PROFISSIONAL' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-slate-700">Categoria Principal</label>
                  <select 
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Preço Médio por Hora (R$)" type="number" value={form.pricePerHour} onChange={e => setForm({...form, pricePerHour: Number(e.target.value)})} />
                <Input label="Breve Resumo (Bio)" multiline value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Conte um pouco sobre sua experiência..." />
              </>
            )}

            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Voltar</Button>
              <Button onClick={handleRegister} className="flex-2">Finalizar Cadastro</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Register;
