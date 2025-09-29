import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Aluno, Aula } from "@/lib/utils/types";

// A lógica de estado que estava em PresencaTab agora vive aqui
interface RegistroAluno {
  presente: boolean;
  horasFalta: number;
}
type RegistroPresenca = Record<number, RegistroAluno>;

// --- MOCKS ---
const mockAula: Aula = {
  id: 1,
  data: "2025-09-10",
  descricao: "Introdução ao SQL",
  ComponenteTurmaId: 2,
  cargahoraria: 4,
};

const mockAlunos: Aluno[] = [
  { id: 1, nome: "Carlos Pereira" },
  { id: 2, nome: "Beatriz Martins" } /* ... */,
];
// ---

export default function PresencaPage() {
  const { turmaId, aulaId } = useParams<{ turmaId: string; aulaId: string }>();

  // Estados da página
  const [aula, setAula] = useState<Aula | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [presencas, setPresencas] = useState<RegistroPresenca>({});
  const [loading, setLoading] = useState(true);

  // Efeito para buscar os dados da aula e alunos
  useEffect(() => {
    // API.get(`/aulas/${aulaId}/presenca`) -> retornaria a aula, alunos e presenças existentes
    setAula(mockAula);
    setAlunos(mockAlunos);

    // Inicializa o estado de presença com todos os alunos presentes
    const presencasIniciais = mockAlunos.reduce((acc, aluno) => {
      acc[aluno.id] = { presente: true, horasFalta: 0 };
      return acc;
    }, {} as RegistroPresenca);
    setPresencas(presencasIniciais);

    setLoading(false);
  }, [aulaId]);

  // Função para lidar com a mudança do toggle de presença
  const handlePresencaChange = (alunoId: number) => {
    setPresencas((prev) => {
      const registroAtual = prev[alunoId];
      const novoStatusPresente = !registroAtual.presente;

      return {
        ...prev,
        [alunoId]: {
          presente: novoStatusPresente,
          horasFalta: novoStatusPresente ? 0 : registroAtual.horasFalta,
        },
      };
    });
  };

  // Função para lidar com a mudança no input de horas de falta
  const handleHorasFaltaChange = (alunoId: number, horas: string) => {
    // Converte a string do input para número, tratando o caso de campo vazio como 0
    //const horasNumero = parseInt(horas, 10) || 0;
    const horasNumero = Number(horas) || 0;
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        horasFalta: horasNumero,
      },
    }));
  };

  const salvarPresencas = () => {
    console.log(presencas);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <Link to={`/turma/${turmaId}`} className="text-sm ...">
            &larr; Voltar para a Turma
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">
            Lançamento de Presença
          </h1>
          <p className="text-slate-600">
            Aula de {aula?.descricao} em{" "}
            {new Date(aula!.data).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </p>
        </header>

        {/* Aqui entra a UI da lista de alunos com o toggle, exatamente como fizemos antes */}
        <div className="bg-white p-6 rounded-lg ...">
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-3 border-b pb-2">
              Lista de Alunos
            </h3>
            <div className="space-y-3">
              {alunos.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex flex-row justify-between items-center p-3 bg-slate-50 rounded-md gap-4"
                >
                  <span className="text-slate-800 font-medium">
                    {aluno.nome}
                  </span>

                  {presencas[aluno.id] && !presencas[aluno.id].presente && (
                    <div className="flex items-center gap-2 h-6">
                      <input
                        type="number"
                        min="0"
                        placeholder="Horas"
                        value={presencas[aluno.id]?.horasFalta || ""}
                        onChange={(e) =>
                          handleHorasFaltaChange(aluno.id, e.target.value)
                        }
                        className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm text-center"
                      />
                      <label className="text-sm text-slate-600">falta(s)</label>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`presenca-${aluno.id}`}
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`presenca-${aluno.id}`}
                        className="sr-only peer"
                        checked={presencas[aluno.id]?.presente ?? true}
                        onChange={() => handlePresencaChange(aluno.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        Presente
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={salvarPresencas}
                className="bg-slate-900 text-white font-medium px-6 py-2 rounded-lg hover:opacity-90"
              >
                Salvar Presenças
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
