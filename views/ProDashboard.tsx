
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/Common';
import { Professional, ServiceStatus } from '../types';

const ProDashboard: React.FC = () => {
  const { currentUser, requests, updateRequest, allUsers } = useApp();
  const pro = currentUser as Professional;

  const myJobs = requests.filter(r => r.proId === pro.id);
  const totalEarnings = myJobs.filter(j => j.status === ServiceStatus.PAID).reduce((acc, curr) => acc + curr.proEarnings, 0);

  const handleStatusChange = (id: string, newStatus: ServiceStatus) => {
    updateRequest(id, { status: newStatus });
    alert(`Status do serviço atualizado para: ${newStatus}`);
  };

  if (!pro.isVerified) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <Card className="p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            <i className="fas fa-user-clock"></i>
          </div>
          <h2 className="text-2xl font-bold">Aguardando Aprovação</h2>
          <p className="text-slate-600">
            Seu cadastro foi enviado e está sendo analisado pela nossa equipe. 
            Você receberá um email assim que for aprovado para começar a atender.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-500 text-left">
            <h4 className="font-bold mb-1">O que analisamos?</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Documentação (CPF/CNPJ)</li>
              <li>Fotos do portfólio</li>
              <li>Referências profissionais</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-blue-600 text-white border-none">
          <p className="text-blue-100 text-sm font-bold uppercase">Ganhos Totais</p>
          <h3 className="text-4xl font-black mt-2">R$ {totalEarnings.toFixed(2)}</h3>
          <p className="text-xs text-blue-200 mt-2">Valores liberados após conclusão.</p>
        </Card>
        <Card className="p-6">
          <p className="text-slate-400 text-sm font-bold uppercase">Avaliação Média</p>
          <h3 className="text-4xl font-black mt-2 text-slate-800">{pro.rating || "---"}</h3>
          <div className="flex items-center gap-1 text-yellow-500 mt-2">
            {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star"></i>)}
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-slate-400 text-sm font-bold uppercase">Serviços Pendentes</p>
          <h3 className="text-4xl font-black mt-2 text-slate-800">
            {myJobs.filter(j => j.status === ServiceStatus.PENDING).length}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Solicitações aguardando resposta.</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Gerenciar Serviços</h2>
        <div className="flex flex-col gap-4">
          {myJobs.length === 0 ? (
            <Card className="p-10 text-center text-slate-500">
              Você ainda não recebeu nenhuma solicitação de serviço.
            </Card>
          ) : (
            myJobs.map(job => {
              const client = allUsers.find(u => u.id === job.clientId);
              return (
                <Card key={job.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          job.status === ServiceStatus.PENDING ? 'warning' :
                          job.status === ServiceStatus.ACCEPTED ? 'info' :
                          job.status === ServiceStatus.COMPLETED ? 'success' : 'neutral'
                        }>
                          {job.status}
                        </Badge>
                        <span className="text-xs text-slate-400">{new Date(job.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <p className="text-slate-600">{job.description}</p>
                      
                      <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg">
                        <img src={client?.avatar || `https://ui-avatars.com/api/?name=${client?.name}`} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase">Cliente</p>
                          <p className="font-bold text-slate-800">{client?.name}</p>
                          <p className="text-xs text-slate-500">{client?.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end justify-between min-w-[200px]">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">Seu Ganho</p>
                        <p className="text-2xl font-black text-blue-600">R$ {job.proEarnings.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-400">Total Pago pelo Cliente: R$ {job.totalValue.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 justify-end">
                        {job.status === ServiceStatus.PENDING && (
                          <>
                            <Button variant="danger" onClick={() => handleStatusChange(job.id, ServiceStatus.CANCELLED)}>Recusar</Button>
                            <Button onClick={() => handleStatusChange(job.id, ServiceStatus.ACCEPTED)}>Aceitar Serviço</Button>
                          </>
                        )}
                        {job.status === ServiceStatus.ACCEPTED && (
                          <Button variant="outline" onClick={() => handleStatusChange(job.id, ServiceStatus.COMPLETED)}>Finalizar Trabalho</Button>
                        )}
                        {job.status === ServiceStatus.COMPLETED && (
                          <span className="text-sm font-bold text-slate-500 italic">Aguardando pagamento do cliente</span>
                        )}
                        {job.status === ServiceStatus.PAID && (
                          <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                            <i className="fas fa-check-circle"></i> Dinheiro na Conta
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
      </div>
    </div>
  );
};

export default ProDashboard;
