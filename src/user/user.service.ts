const API_BASE_URL = "http://localhost:3000";

export interface User {
  id: number;
  name: string;
  email: string;
  unidade?: string;
  role: string;
  trilha?: {
    id: number;
    name: string;
  };
}

export async function buscarUsuarios(): Promise<User[]> {
  try {
    console.log('🔍 Buscando usuários em:', `${API_BASE_URL}/users`);
    
    const response = await fetch(`${API_BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const users = await response.json();
    console.log('✅ Usuários carregados:', users);
    
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    return [];
  }
}

export async function buscarUsuariosPorTermo(termo: string): Promise<User[]> {
  const users = await buscarUsuarios();
  
  if (!termo.trim()) return users;
  
  return users.filter(user =>
    user.name.toLowerCase().includes(termo.toLowerCase()) ||
    user.email.toLowerCase().includes(termo.toLowerCase()) ||
    user.unidade?.toLowerCase().includes(termo.toLowerCase())
  );
}