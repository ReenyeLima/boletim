import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

// Componentes de UI
import { Sidebar } from "@/components/sidebar";
import { TarefasTab } from "@/components/tarefastab";

// Tipos centralizados para garantir consistência em todo o app
import {
  ApiResponseItem,
  Tarefa,
  ComponenteCurricular,
  Aluno,
  Aula,
} from "@/lib/utils/types"; // Ajuste o caminho se necessário
import { api } from "@/services/api";
import { AulasTab } from "@/components/aulastab";

// Alunos também viriam da API, provavelmente em outra chamada ou na mesma.
const mockAlunos: Aluno[] = [
  { id: 1, nome: "Carlos Pereira" },
  { id: 2, nome: "Beatriz Martins" },
  { id: 3, nome: "Daniela Costa" },
];
// --- FIM DOS DADOS SIMULADOS ---
const mockAulas: Aula[] = [
  {
    id: 1,
    data: "2025-09-10",
    descricao: "Introdução ao SQL",
    ComponenteTurmaId: 2,
    cargahoraria: 4,
  },
  {
    id: 2,
    data: "2025-09-08",
    descricao: "Estrutura básica de HTML",
    ComponenteTurmaId: 1,
    cargahoraria: 4,
  },
];
// Tipo para controlar a aba ativa
type ActiveTab = "tarefas" | "presenca";

export default function TurmaPage() {
  const { turmaId } = useParams<{ turmaId: string }>();
  const [aulas, setAulas] = useState<Aula[]>(mockAulas);
  // Estados para os dados já normalizados e prontos para uso
  const [componentes, setComponentes] = useState<ComponenteCurricular[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmaInfo, setTurmaInfo] = useState({ nome: "", sigla: "" });

  // Estados de UI
  const [activeTab, setActiveTab] = useState<ActiveTab>("tarefas");
  const [loading, setLoading] = useState(true);

  // Efeito para buscar e processar os dados da turma quando o componente for montado
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Em um cenário real, a chamada à API seria feita aqui:
        // const response = await api.get(`/turmas/${turmaId}/componentes-e-atividades`);
        // const data = response.data;
        const data = await api
          .get(`/turmas/${turmaId}/atividades`)
          .then((resp) => {
            setTurmaInfo(resp.data[0].turma);
            return resp.data;
          });

        // --- Processo de Normalização ---
        // Transforma os dados aninhados da API em listas planas, mais fáceis de gerenciar.
        const allComponentes: ComponenteCurricular[] = [];
        const allTarefas: Tarefa[] = [];

        data.forEach((item: ApiResponseItem) => {
          // 1. Extrai e armazena o componente
          allComponentes.push({
            id: item.id,
            nome: item.componente.nome,
          });

          // 2. Extrai, mapeia e armazena as atividades (tarefas)
          item.Atividades.forEach((atividade) => {
            allTarefas.push({
              id: atividade.id,
              titulo: atividade.titulo,
              ComponenteTurmaId: atividade.ComponenteTurmaId,
              componente: item.componente,
              peso: atividade.peso,
              dataLimite: atividade.dataLimite.split("T")[0], // Converte para o formato 'YYYY-MM-DD'
              tipo: atividade.tipo,
            });
          });
        });

        // Atualiza os estados com os dados normalizados
        setComponentes(allComponentes);
        setTarefas(
          allTarefas.sort(
            (a, b) =>
              new Date(a.dataLimite).getTime() -
              new Date(b.dataLimite).getTime()
          )
        );
        setAlunos(mockAlunos);

        const dataAulas = await api
          .get(`/turmas/${turmaId}/aulas`)
          .then((resp) => {
            console.log(turmaId, resp.data);
            return resp.data;
          });
      } catch (error) {
        console.error("Falha ao buscar dados da turma:", error);
        // Aqui você poderia definir um estado de erro para exibir uma mensagem na tela
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [turmaId]); // Roda o efeito novamente se o ID da turma na URL mudar

  const handleNovaAula = (novaAula: Omit<Aula, "id">) => {
    api.post("/aulas", novaAula).then((resp) => {
      console.log(resp);
      if (resp.status === 201) {
        const insertedAula = resp.data;
        const attAulas = [...aulas, insertedAula];
        setAulas(attAulas);
      } else {
        console.log("err");
      }
    });
  };

  const handleNovaTarefa = (novaTarefa: Omit<Tarefa, "id">) => {
    api.post("/atividades", novaTarefa).then((resp) => {
      if (resp.status === 201) {
        setTarefas((prevTarefas) =>
          [
            ...prevTarefas,
            {
              ...novaTarefa,
              id: resp.data.id,
            },
          ].sort(
            (a, b) =>
              new Date(a.dataLimite).getTime() -
              new Date(b.dataLimite).getTime()
          )
        );
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          {/* O nome do curso viria dos dados da turma */}
          <h1 className="text-3xl font-bold text-slate-800">
            {turmaInfo.nome}
          </h1>
          <p className="text-slate-600">{turmaInfo.sigla}</p>
        </header>

        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("tarefas")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "tarefas"
                ? "border-b-2 border-slate-800 text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Tarefas
          </button>
          <button
            onClick={() => setActiveTab("presenca")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "presenca"
                ? "border-b-2 border-slate-800 text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Aulas
          </button>
        </div>

        {loading ? (
          <p className="text-slate-600 text-center py-8">
            Carregando dados da turma...
          </p>
        ) : (
          <div>
            {activeTab === "tarefas" && (
              <TarefasTab
                tarefasIniciais={tarefas}
                componentes={componentes}
                onAdicionarTarefa={handleNovaTarefa}
              />
            )}
            {activeTab === "presenca" && (
              <AulasTab
                aulasIniciais={aulas}
                componentes={componentes}
                onAdicionarAula={handleNovaAula}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
