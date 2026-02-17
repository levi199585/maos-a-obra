
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/Common';
import { Professional, ServiceStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const { allUsers, requests, verifyProfessional } = useApp();
  const [activeTab, setActiveTab] = useState<'VERIFICACAO' | 'FINANCEIRO'>('VERIFICACAO');

  const pendingPros = allUsers.filter(u => u.role === 'PROFISSIONAL' && !u.isVerified) as Professional[];
  const allPros = allUsers.filter(u => u.role === 'PROFISSIONAL') as Professional[];
  const completedRequests = requests.filter(r => r.status === ServiceStatus.PAID);
  
  const totalCommission = completedRequests.reduce((acc, curr) => acc + curr.commission, 0);
  const totalVolume = completedRequests.reduce((acc, curr) => acc + curr.totalValue, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('VERIFICACAO')}
            className={`px-4 py-2 font-bold rounded-lg ${activeTab === 'VERIFICACAO' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Verificação de Profissionais
          </button>
          <button 
            onClick={() => setActiveTab('FINANCEIRO')}
            className={`px-4 py-2 font-bold rounded-lg ${activeTab === 'FINANCEIRO' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Relatórios Financeiros
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-900 font-bold">
           <i className="fas fa-user-shield"></i>
           Painel Administrativo
        </div>
      </div>

      {activeTab === 'VERIFICACAO' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Profissionais Aguardando Aprovação ({pendingPros.length})</h2>
          {pendingPros.length === 0 ? (
            <Card className="p-10 text-center text-slate-500">Tudo em dia! Nenhum cadastro pendente.</Card>
          ) : (
            pendingPros.map(pro => (
              <Card key={pro.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center gap-4">
                  <img src={pro.avatar || `https://ui-avatars.com/api/?name=${pro.name}`} className="w-12 h-12 rounded-full" alt="" />
                  <div>
                    <h3 className="font-bold text-lg">{pro.name}</h3>
                    <p className="text-sm text-slate-500">{pro.email} • {pro.cpf}</p>
                    <Badge variant="info">{pro.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline">Ver Detalhes</Button>
                  <Button onClick={() => verifyProfessional(pro.id)}>Aprovar Cadastro</Button>
                </div>
              </Card>
            ))
          )}

          <h2 className="text-xl font-bold mt-8">Profissionais Ativos ({allPros.filter(p => p.isVerified).length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {allPros.filter(p => p.isVerified).map(p => (
               <Card key={p.id} className="p-4 flex items-center gap-3">
                 <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.name}`} className="w-10 h-10 rounded-full" alt="" />
                 <div>
                   <p className="text-sm font-bold truncate max-w-[120px]">{p.name}</p>
                   <p className="text-[10px] uppercase font-bold text-slate-400">{p.category}</p>
                 </div>
               </Card>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'FINANCEIRO' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-slate-900 text-white">
              <p className="text-slate-400 text-xs font-bold uppercase">Volume Total Transacionado</p>
              <h3 className="text-3xl font-black mt-1">R$ {totalVolume.toFixed(2)}</h3>
            </Card>
            <Card className="p-6 bg-green-600 text-white">
              <p className="text-green-100 text-xs font-bold uppercase">Comissão Acumulada (Líquido)</p>
              <h3 className="text-3xl font-black mt-1">R$ {totalCommission.toFixed(2)}</h3>
            </Card>
            <Card className="p-6">
              <p className="text-slate-400 text-xs font-bold uppercase">Serviços Pagos</p>
              <h3 className="text-3xl font-black mt-1">{completedRequests.length}</h3>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="p-4 bg-slate-50 border-b font-bold flex justify-between">
              <span>Histórico de Transações</span>
              <span className="text-slate-400 text-xs">Apenas pagamentos concluídos</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-xs uppercase text-slate-500 font-bold border-b">
                    <th className="px-6 py-4">Serviço</th>
                    <th className="px-6 py-4">Valor Total</th>
                    <th className="px-6 py-4">Comissão (15%)</th>
                    <th className="px-6 py-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{req.title}</td>
                      <td className="px-6 py-4 font-bold">R$ {req.totalValue.toFixed(2)}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">R$ {req.commission.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {completedRequests.length === 0 && (
                <div className="py-10 text-center text-slate-400 italic">Nenhuma transação concluída ainda.</div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
