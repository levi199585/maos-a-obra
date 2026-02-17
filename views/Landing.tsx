
import React from 'react';
import { Button } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'CLIENTE') navigate('/dashboard/cliente');
      else if (currentUser.role === 'PROFISSIONAL') navigate('/dashboard/profissional');
      else if (currentUser.role === 'ADMIN') navigate('/dashboard/admin');
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex flex-col gap-16 py-10">
      <section className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Sua obra sem dor de cabeça.
          </h1>
          <p className="text-xl text-slate-600">
            Encontre os melhores pedreiros, eletricistas e pintores da sua região. 
            Seguro, rápido e garantido.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button onClick={() => navigate('/register')} className="!px-8 !py-4 text-lg">
              Preciso de um serviço
            </Button>
            <Button variant="outline" onClick={() => navigate('/register')} className="!px-8 !py-4 text-lg">
              Sou profissional
            </Button>
          </div>
          <div className="flex items-center gap-6 text-slate-500 pt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">500+</span>
              <span className="text-xs uppercase font-semibold">Profissionais</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">10k+</span>
              <span className="text-xs uppercase font-semibold">Obras Concluídas</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">4.9/5</span>
              <span className="text-xs uppercase font-semibold">Avaliação Média</span>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="relative">
             <img 
              src="https://picsum.photos/seed/construction/800/600" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
              alt="Construction worker"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-800">Pagamento Seguro</p>
                  <p className="text-xs text-slate-500">Liberação após conclusão</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white p-10 rounded-3xl text-center space-y-4">
        <h2 className="text-3xl font-bold">Por que usar o Mãos à Obra?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="space-y-2">
            <i className="fas fa-check-double text-4xl mb-2 text-blue-200"></i>
            <h3 className="text-xl font-bold">Seleção Rigorosa</h3>
            <p className="text-blue-100">Profissionais verificados e com referências reais.</p>
          </div>
          <div className="space-y-2">
            <i className="fas fa-credit-card text-4xl mb-2 text-blue-200"></i>
            <h3 className="text-xl font-bold">Tudo pelo App</h3>
            <p className="text-blue-100">Orçamentos, pagamentos e conversas em um só lugar.</p>
          </div>
          <div className="space-y-2">
            <i className="fas fa-star text-4xl mb-2 text-blue-200"></i>
            <h3 className="text-xl font-bold">Qualidade Garantida</h3>
            <p className="text-blue-100">Avalie e veja avaliações reais de outros clientes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
