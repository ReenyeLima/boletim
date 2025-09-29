import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar"; // Supondo que os componentes estejam em uma pasta 'components'
import { ClassCard, TurmasArray } from "@/components/classcard";

import { useAuthStore } from "@/lib/store/authStore";

import { api } from "@/services/api"; // Reutilizando sua instância da api
import jwt from "@/services/jwt";

export default function DashboardDocente() {
  const userData = jwt.decodeToken(useAuthStore.getState().token);

  const [turmas, setTurmas] = useState<TurmasArray>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para buscar os dados das turmas quando o componente for montado
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        await api.get("/turmas/usuario/" + userData.id).then((resp) => {
          setTurmas(resp.data);
        });
      } catch (err) {
        setError(
          "Não foi possível carregar as turmas. Tente novamente mais tarde."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurmas();
  }, []); // O array vazio [] garante que isso só rode uma vez

  const renderContent = () => {
    if (loading) {
      return <p className="text-slate-600">Carregando turmas...</p>;
    }

    if (error) {
      return <p className="text-red-600">{error}</p>;
    }

    if (turmas.length === 0) {
      return (
        <p className="text-slate-600">
          Nenhuma turma encontrada para este docente.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {turmas.map((turma, index) => (
          <ClassCard key={index} turma={turma.Turmas} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      {/* Menu Lateral Esquerdo */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Minhas Turmas</h1>
          <p className="text-slate-600 mt-1">
            Acesse as notas, presenças e tarefas de cada turma.
          </p>
        </header>

        {/* Lista de Turmas */}
        {renderContent()}
      </main>
    </div>
  );
}
