
export type UserRole = 'CLIENTE' | 'PROFISSIONAL' | 'ADMIN';

export enum ServiceStatus {
  PENDING = 'PENDENTE',
  ACCEPTED = 'ACEITO',
  COMPLETED = 'CONCLUÍDO',
  PAID = 'PAGO',
  CANCELLED = 'CANCELADO'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  cpf: string;
  avatar?: string;
  isVerified: boolean;
  wallet: number;
}

export interface Professional extends User {
  category: string;
  bio: string;
  pricePerHour: number;
  availability: string;
  portfolio: string[];
  rating: number;
  reviewsCount: number;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  proId: string;
  title: string;
  description: string;
  category: string;
  status: ServiceStatus;
  createdAt: string;
  totalValue: number;
  commission: number;
  proEarnings: number;
  rating?: number;
  review?: string;
  imageUrl?: string;
}

export interface AppState {
  currentUser: User | Professional | null;
  allUsers: (User | Professional)[];
  requests: ServiceRequest[];
}
