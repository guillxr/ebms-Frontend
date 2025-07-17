import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Bem-vindo ao Dashboard!</h1>
      <p className="text-lg text-gray-600">Aqui você verá suas informações e métricas importantes.</p>
      {/* Adicione mais conteúdo do dashboard aqui */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Métrica 1</h2>
          <p className="text-gray-500">Valor: 1234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Métrica 2</h2>
          <p className="text-gray-500">Status: Ativo</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Métrica 3</h2>
          <p className="text-gray-500">Progresso: 75%</p>
        </div>
      </div>
    </div>
  );
}