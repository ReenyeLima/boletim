import { useState, useEffect } from "react";
import { ComponenteCurricular, Aluno } from "@/lib/utils/types"; // Ajuste o caminho se necessário

interface PresencaTabProps {
  alunos: Aluno[];
  componentes: ComponenteCurricular[];
}

// Modelo de estado para cada registro de aluno
interface RegistroAluno {
  presente: boolean;
  horasFalta: number;
}

// O estado principal será um objeto onde a chave é o ID do aluno
type RegistroPresenca = Record<number, RegistroAluno>;

export function PresencaTab({ alunos, componentes }: PresencaTabProps) {
  const [dataAula, setDataAula] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [componenteId, setComponenteId] = useState<number | "">("");
  const [presencas, setPresencas] = useState<RegistroPresenca>({});
  var conta = 0;

  // Efeito para inicializar o estado de presença quando um componente é selecionado.
  // Garante que todos os alunos comecem como "presentes".
  useEffect(() => {
    if (componenteId && alunos.length > 0) {
      const presencasIniciais = alunos.reduce((acc, aluno) => {
        // Para cada aluno, cria um registro inicial com presença=true
        if (conta == 1) {
          acc[aluno.id] = { presente: false, horasFalta: 3 };
        } else {
          acc[aluno.id] = { presente: true, horasFalta: 0 };
        }
        conta++;
        return acc;
      }, {} as RegistroPresenca);
      setPresencas(presencasIniciais);
    } else {
      // Limpa o estado se nenhum componente for selecionado
      setPresencas({});
    }
  }, [componenteId, alunos]); // Re-executa se o componente ou a lista de alunos mudar

  const handleComponenteChange = (id: string) => {
    setComponenteId(id ? parseInt(id, 10) : "");
  };

  // Função para lidar com a mudança do toggle de presença
  const handlePresencaChange = (alunoId: number) => {
    setPresencas((prev) => {
      const registroAtual = prev[alunoId];
      const novoStatusPresente = !registroAtual.presente;

      return {
        ...prev,
        [alunoId]: {
          presente: novoStatusPresente,
          // Se o aluno está sendo marcado como presente, zera as horas de falta
          horasFalta: novoStatusPresente ? 0 : registroAtual.horasFalta,
        },
      };
    });
  };

  // Função para lidar com a mudança no input de horas de falta
  const handleHorasFaltaChange = (alunoId: number, horas: string) => {
    // Converte a string do input para número, tratando o caso de campo vazio como 0
    const horasNumero = parseInt(horas, 10) || 0;
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        horasFalta: horasNumero,
      },
    }));
  };

  const salvarPresencas = () => {
    // Aqui você enviaria os dados formatados para sua API
    console.log({
      componenteId,
      data: dataAula,
      registros: presencas,
    });
    alert("Presenças salvas com sucesso! (Simulação)");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">
        Registrar Aula e Presença
      </h2>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="componente-aula"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Componente Curricular
            </label>
            <select
              id="componente-aula"
              value={componenteId}
              onChange={(e) => handleComponenteChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">Selecione um componente para iniciar...</option>
              {componentes.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="data-aula"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Data da Aula
            </label>
            <input
              type="date"
              id="data-aula"
              value={dataAula}
              onChange={(e) => setDataAula(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {componenteId ? (
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-3 border-b pb-2">
              Lista de Alunos
            </h3>
            <div className="space-y-3">
              {alunos.map((aluno) => (
                <div
                  key={aluno.id}
                  className="grid grid-cols-2 md:grid-cols-3 items-center p-3 bg-slate-50 rounded-md gap-4"
                >
                  <span className="text-slate-800 font-medium">
                    {aluno.nome}
                  </span>

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

                  <div className="justify-self-start md:justify-self-end">
                    {/* Este campo só aparece se o aluno NÃO estiver presente */}
                    {presencas[aluno.id] && !presencas[aluno.id].presente && (
                      <div className="flex items-center gap-2">
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
                        <label className="text-sm text-slate-600">
                          falta(s)
                        </label>
                      </div>
                    )}
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
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-lg">
            <p className="text-slate-500">
              Selecione um componente curricular para ver a lista de alunos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
