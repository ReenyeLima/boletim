import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Tarefa, Aluno, ComponenteCurricular } from "@/lib/utils/types"; // Supondo que seus tipos estejam aqui
import { api } from "@/services/api";

// Interface para o modelo Entregas do Prisma
interface Entrega {
  id: number;
  atividadeId: number;
  alunoId: number;
  dataEntrega: string;
  nota: number | null;
}

interface Dictionary {
  [key: string]: any;
}

// --- DADOS SIMULADOS (MOCKS) ---
// Em um app real, estes dados viriam de uma chamada à API baseada nos IDs da URL
const mockAtividade: Omit<Tarefa, "componente"> = {
  id: 101,
  titulo: "Atividade SOMATIVA (Peso: 5)",
  ComponenteTurmaId: 1,
  peso: 5,
  dataLimite: "2025-08-26",
  tipo: "SOM",
};
const mockAlunos: Aluno[] = [
  { id: 1, nome: "Carlos Pereira" },
  { id: 2, nome: "Beatriz Martins" },
  { id: 3, nome: "Daniela Costa" },
  { id: 4, nome: "Eduardo Almeida" },
];
const mockEntregasExistentes: Entrega[] = [
  {
    id: 1,
    atividadeId: 101,
    alunoId: 2,
    dataEntrega: "2025-08-25T10:00:00.000Z",
    nota: 8.5,
  },
  {
    id: 2,
    atividadeId: 101,
    alunoId: 3,
    dataEntrega: "2025-08-26T14:00:00.000Z",
    nota: 7.0,
  },
];
// --- FIM DOS DADOS SIMULADOS ---

export default function AtividadePage() {
  const { turmaId, atividadeId } = useParams<{
    turmaId: string;
    atividadeId: string;
  }>();

  // Estado para os dados da página
  const [atividade, setAtividade] = useState<Omit<Tarefa, "componente"> | null>(
    null
  );
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para gerenciar as notas nos inputs. A chave é o ID do aluno.
  const [notas, setNotas] = useState<Dictionary>({});
  const [novasNotas, setNovasNotas] = useState<Dictionary>({});

  useEffect(() => {
    // Aqui você faria a chamada à API para buscar os dados
    const fetchDadosEntrega = async () => {
      setLoading(true);

      await api.get(`/turmas/${turmaId}`).then((resp) => {
        setAlunos(resp.data.Alunos);
      });

      await api.get(`/atividades/${atividadeId}`).then((resp) => {
        const notasIniciais = resp.data.Entregas.reduce(
          (acc: any, entrega: any) => {
            acc[entrega.alunoId] =
              entrega.nota !== null ? String(entrega.nota) : "";
            return acc;
          },
          {} as Record<number, string>
        );

        setNotas(notasIniciais);

        const { entregas, ...atv } = resp.data;

        setAtividade(atv);
      });

      // Preenche o estado inicial das notas com os valores já existentes

      setLoading(false);
    };

    fetchDadosEntrega();
  }, [atividadeId]);

  // Função para atualizar a nota de um aluno no estado
  const handleNotaChange = (alunoId: number, nota: string) => {
    setNotas((prevNotas) => ({
      ...prevNotas,
      [alunoId]: nota,
    }));

    setNovasNotas((prevNotas) => ({
      ...prevNotas,
      [alunoId]: nota,
    }));
  };

  // Função para salvar as notas (simulação de envio para a API)
  const handleSalvarNotas = async () => {
    var entregas: Omit<Entrega, "id" | "dataEntrega">[] = [];

    Object.keys(novasNotas).forEach((key) => {
      entregas.push({
        atividadeId: Number(atividadeId),
        alunoId: Number(key),
        nota: Number(novasNotas[key]),
      });
    });

    await api
      .post(`/atividades/${atividadeId}/entrega`, entregas)
      .then((resp) => {
        if (resp.status === 201) {
          alert("Notas salvas com sucesso! (Simulação)");
        }
      });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <div className="text-sm text-slate-500 mb-2">
            <Link to={`/turma/${turmaId}`} className="hover:underline">
              Voltar para a Turma
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Lançamento de Notas
          </h1>
          <p className="text-slate-600">
            Atividade:{" "}
            <span className="font-semibold">{atividade?.titulo}</span>
          </p>
        </header>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-bold text-slate-700">
              Alunos da Turma
            </h2>
            <button
              onClick={handleSalvarNotas}
              className="bg-slate-900 text-white font-medium px-6 py-2 rounded-lg hover:opacity-90"
            >
              Salvar Notas
            </button>
          </div>

          <div className="space-y-3">
            {alunos.map((aluno) => (
              <div
                key={aluno.id}
                className="flex justify-between items-center p-3 px-5 bg-slate-50 rounded-md"
              >
                <span className="text-slate-800 font-medium col-span-2">
                  {aluno.nome}
                </span>
                <div className="col-span-1">
                  <input
                    type="number"
                    placeholder="-"
                    step="0.1"
                    min="0"
                    max="10"
                    value={notas[aluno.id] || ""}
                    onChange={(e) => handleNotaChange(aluno.id, e.target.value)}
                    className="w-full max-w-[100px] rounded-lg border border-slate-300 px-3 py-2 text-sm text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
