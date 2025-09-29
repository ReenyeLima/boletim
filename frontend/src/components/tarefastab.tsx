// src/components/tabs/TarefasTab.tsx

import { useState, useMemo } from "react";
import { ModalNovaTarefa } from "./modalnovatarefa";
import { Tarefa, ComponenteCurricular } from "@/lib/utils/types";

import { useNavigate, useParams } from "react-router-dom";

interface TarefasTabProps {
  tarefasIniciais: Tarefa[];
  componentes: ComponenteCurricular[];
  onAdicionarTarefa: (novaTarefa: Omit<Tarefa, "id">) => void;
}

export function TarefasTab({
  tarefasIniciais,
  componentes,
  onAdicionarTarefa,
}: TarefasTabProps) {
  const { turmaId } = useParams<{
    turmaId: string;
  }>();

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filtroComponente, setFiltroComponente] = useState<string | number>(
    "todos"
  );

  const tarefasFiltradas = useMemo(() => {
    if (filtroComponente === "todos") {
      return tarefasIniciais;
    }
    // Convertemos o filtro para número para a comparação, já que o value do <select> vem como string
    return tarefasIniciais.filter(
      (t) => t.ComponenteTurmaId == filtroComponente
    );
  }, [tarefasIniciais, filtroComponente]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="filtro-componente"
            className="text-sm font-medium text-slate-600"
          >
            Filtrar por:
          </label>
          <select
            id="filtro-componente"
            value={filtroComponente}
            onChange={(e) => setFiltroComponente(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
          >
            <option value="todos">Todos os Componentes</option>
            {componentes.map((comp, index) => (
              <option key={index} value={comp.id}>
                {comp.nome}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 shadow-sm cursor-pointer"
        >
          Adicionar Atividade
        </button>
      </div>

      <div className="space-y-4">
        {tarefasFiltradas.map((tarefa) => (
          <div
            key={tarefa.id}
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm cursor-pointer"
            onClick={() => {
              navigate(`/turma/${turmaId}/atividade/${tarefa.id}`);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800">{`Atividade ${tarefa.titulo} (Peso: ${tarefa.peso})`}</h3>
                <p className="text-sm text-slate-500">
                  Entrega:{" "}
                  {new Date(tarefa.dataLimite).toLocaleString("pt-Br", {
                    dateStyle: "short",
                    timeZone: "UTC",
                  })}
                </p>
              </div>
              <div className="text-right">
                {/* Exibindo o componente */}
                <span className="text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
                  {tarefa.componente.nome}
                </span>
                {/* NOVO: Exibindo o tipo da atividade */}
                <p className="text-xs text-slate-500 mt-2">
                  Tipo:{" "}
                  <span className="font-semibold">
                    {tarefa.tipo == "SOM"
                      ? "Somativa"
                      : tarefa.tipo == "FOR"
                      ? "Formativa"
                      : "Diagnóstica"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* ... mensagem de "nenhuma tarefa" ... */}
      </div>

      {/* O modal continua o mesmo, ele já recebe a lista de componentes normalizada */}
      <ModalNovaTarefa
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAdicionarTarefa}
        componentes={componentes}
      />
    </div>
  );
}
