
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input, Badge } from '../components/Common';
import { SERVICE_CATEGORIES, ICONS, COMMISSION_RATE } from '../constants.tsx';
import { Professional, ServiceRequest, ServiceStatus } from '../types';
import { getAIAssistance } from '../services/geminiService';

const ClientDashboard: React.FC = () => {
  const { allUsers, requests, createRequest, currentUser, updateRequest } = useApp();
  const [activeTab, setActiveTab] = useState<'EXPLORAR' | 'MEUS_PEDIDOS'>('EXPLORAR');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  
  // New Request Form
  const [newReq, setNewReq] = useState({ title: '', description: '', category: SERVICE_CATEGORIES[0] });
  const [isAIThinking, setIsAIThinking] = useState(false);

  const professionals = allUsers.filter(u => u.role === 'PROFISSIONAL' && u.isVerified) as Professional[];
  const myRequests = requests.filter(r => r.clientId === currentUser?.id);

  const handleAIHelp = async () => {
    if (!newReq.description) return;
    setIsAIThinking(true);
    const help = await getAIAssistance(newReq.description);
    if (help) {
      setNewReq({
        ...newReq,
        description: help.refinedDescription,
        category: help.suggestedCategory || newReq.category
      });
    }
    setIsAIThinking(false);
  };

  const submitRequest = () => {
    if (!selectedPro || !currentUser) return;
    
    const baseValue = selectedPro.pricePerHour * 4; // Mock: assume 4 hours job
    const commission = baseValue * COMMISSION_RATE;
    
    const request: ServiceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: currentUser.id,
      proId: selectedPro.id,
      title: newReq.title || `${newReq.category} com ${selectedPro.name}`,
      description: newReq.description,
      category: newReq.category,
      status: ServiceStatus.PENDING,
      createdAt: new Date().toISOString(),
      totalValue: baseValue + commission,
      commission: commission,
      proEarnings: baseValue,
    };

    createRequest(request);
    setNewReq({ title: '', description: '', category: SERVICE_CATEGORIES[0] });
    setSelectedPro(null);
    setActiveTab('MEUS_PEDIDOS');
    alert("Solicitação enviada com sucesso!");
  };

  const handlePay = (req: ServiceRequest) => {
    if (confirm(`Confirmar pagamento de R$ ${req.totalValue.toFixed(2)}?`)) {
      updateRequest(req.id, { status: ServiceStatus.PAID });
      alert("Pagamento realizado com sucesso! O profissional será notificado.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('EXPLORAR')}
            className={`px-4 py-2 font-bold rounded-lg ${activeTab === 'EXPLORAR' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Explorar Profissionais
          </button>
          <button 
            onClick={() => setActiveTab('MEUS_PEDIDOS')}
            className={`px-4 py-2 font-bold rounded-lg ${activeTab === 'MEUS_PEDIDOS' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Meus Pedidos
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
           <i className="fas fa-wallet text-blue-600"></i>
           <span className="font-bold">Saldo: R$ {currentUser?.wallet.toFixed(2)}</span>
        </div>
      </div>

      {activeTab === 'EXPLORAR' && !selectedPro && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.length === 0 ? (
            <div className="col-span-full py-10 text-center text-slate-500">
              <i className="fas fa-search text-4xl mb-4 opacity-20"></i>
              <p>Nenhum profissional verificado disponível no momento.</p>
            </div>
          ) : (
            professionals.map(pro => (
              <Card key={pro.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <img 
                      src={pro.avatar || `https://ui-avatars.com/api/?name=${pro.name}&background=random`} 
                      className="w-16 h-16 rounded-xl border-2 border-slate-50"
                      alt={pro.name}
                    />
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <i className="fas fa-star"></i>
                        <span>{pro.rating || "Novo"}</span>
                      </div>
                      <p className="text-xs text-slate-400">({pro.reviewsCount} avaliações)</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{pro.name}</h3>
                  <Badge variant="info">{pro.category}</Badge>
                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">{pro.bio}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-bold">Preço/Hora</span>
                    <span className="text-lg font-extrabold text-blue-600">R$ {pro.pricePerHour.toFixed(2)}</span>
                  </div>
                  <Button onClick={() => setSelectedPro(pro)}>Contratar</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedPro && (
        <Card className="max-w-2xl mx-auto p-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Solicitar Serviço</h2>
            <button onClick={() => setSelectedPro(null)} className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl mb-6">
            <img src={selectedPro.avatar || `https://ui-avatars.com/api/?name=${selectedPro.name}`} className="w-12 h-12 rounded-full" alt="" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Contratando</p>
              <p className="font-bold text-slate-800">{selectedPro.name} ({selectedPro.category})</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input 
              label="O que precisa ser feito?" 
              placeholder="Ex: Vazamento sob a pia da cozinha" 
              value={newReq.title} 
              onChange={e => setNewReq({...newReq, title: e.target.value})} 
            />
            <div className="relative">
              <Input 
                multiline 
                label="Descrição detalhada" 
                placeholder="Descreva o problema aqui..." 
                value={newReq.description} 
                onChange={e => setNewReq({...newReq, description: e.target.value})} 
              />
              <button 
                onClick={handleAIHelp}
                disabled={isAIThinking || !newReq.description}
                className="absolute top-0 right-0 text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50"
              >
                {isAIThinking ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-magic mr-1"></i>}
                Melhorar com IA
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-800 text-sm mb-2">Resumo de Valores Estimado</h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Serviço (Base 4h):</span>
                <span className="font-medium">R$ {(selectedPro.pricePerHour * 4).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Taxa da Plataforma (15%):</span>
                <span className="font-medium">R$ {(selectedPro.pricePerHour * 4 * COMMISSION_RATE).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-blue-200 mt-2 pt-2 text-blue-900">
                <span>Total:</span>
                <span>R$ {(selectedPro.pricePerHour * 4 * (1 + COMMISSION_RATE)).toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={submitRequest} className="w-full !py-4 text-lg">Enviar Solicitação</Button>
          </div>
        </Card>
      )}

      {activeTab === 'MEUS_PEDIDOS' && (
        <div className="flex flex-col gap-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">Você ainda não fez nenhuma solicitação.</p>
              <Button variant="outline" className="mt-4" onClick={() => setActiveTab('EXPLORAR')}>Começar agora</Button>
            </div>
          ) : (
            myRequests.map(req => {
              const pro = allUsers.find(u => u.id === req.proId) as Professional;
              return (
                <Card key={req.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          req.status === ServiceStatus.PENDING ? 'warning' :
                          req.status === ServiceStatus.ACCEPTED ? 'info' :
                          req.status === ServiceStatus.COMPLETED ? 'success' : 'neutral'
                        }>
                          {req.status}
                        </Badge>
                        <span className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold">{req.title}</h3>
                      <p className="text-slate-600 text-sm">{req.description}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <img src={pro?.avatar || `https://ui-avatars.com/api/?name=${pro?.name}`} className="w-6 h-6 rounded-full" alt="" />
                        <span className="text-sm font-semibold">{pro?.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-between min-w-[150px]">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
                        <p className="text-2xl font-black text-slate-900">R$ {req.totalValue.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {req.status === ServiceStatus.COMPLETED && (
                          <Button onClick={() => handlePay(req)}>Pagar Profissional</Button>
                        )}
                        {req.status === ServiceStatus.PAID && (
                          <div className="flex items-center gap-1 text-green-600 font-bold">
                            <i className="fas fa-check-circle"></i> Pago
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
