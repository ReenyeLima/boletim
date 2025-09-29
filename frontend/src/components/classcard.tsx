import { useNavigate } from "react-router-dom";

interface Turma {
  id: number;
  nome: string;
  periodo: string;
  sigla: string;
  alunos: number;
  _count: TurmaCount;
}

interface TurmaCount {
  Alunos: number;
}

// Define o objeto que contém a chave "Turmas"
interface TurmaContainer {
  Turmas: Turma;
}

// Define o tipo para o array completo
export type TurmasArray = TurmaContainer[];

interface ClassCardProps {
  turma: Turma;
}

export function ClassCard({ turma }: ClassCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
      <div className="p-6">
        <span className="text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
          {turma.periodo}
        </span>

        <h3 className="text-xl font-bold text-slate-800 mt-3">{turma.nome}</h3>
        <p className="text-sm text-slate-500">{turma.sigla}</p>

        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <p className="text-sm text-slate-600">{turma._count.Alunos} alunos</p>
          <button
            onClick={() => {
              navigate(
                `/turma/${turma.id}?nome=${turma.nome}&sigla=${turma.sigla}`
              );
            }}
            className="text-sm font-medium text-white bg-slate-900 px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer"
          >
            Acessar Turma
          </button>
        </div>
      </div>
    </div>
  );
}
