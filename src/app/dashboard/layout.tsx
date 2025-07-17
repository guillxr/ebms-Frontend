import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Barra Lateral de Navegação do Dashboard */}
      <aside className="w-64 bg-gray-700 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <ul>
          <li className="mb-2"><a href="/dashboard" className="block hover:bg-gray-600 p-2 rounded">Visão Geral</a></li>
          <li className="mb-2"><a href="/dashboard/reports" className="block hover:bg-gray-600 p-2 rounded">Relatórios</a></li>
          <li className="mb-2"><a href="/profile" className="block hover:bg-gray-600 p-2 rounded">Meu Perfil</a></li>
          {/* Mais links específicos do dashboard */}
        </ul>
      </aside>

      {/* Conteúdo Principal do Dashboard */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}