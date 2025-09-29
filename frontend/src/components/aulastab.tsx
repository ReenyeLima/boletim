import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ModalNovaAula } from "../components/modalnovaaula";
import { Aula, ComponenteCurricular } from "@/lib/utils/types";

interface AulasTabProps {
  aulasIniciais: Aula[];
  componentes: ComponenteCurricular[];
  onAdicionarAula: (novaAula: Omit<Aula, "id">) => void;
}

export function AulasTab({
  aulasIniciais,
  componentes,
  onAdicionarAula,
}: AulasTabProps) {
  const { turmaId } = useParams<{ turmaId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nomeComponenteMap = useMemo(
    () =>
      componentes.reduce((acc, comp) => {
        acc[comp.id] = comp.nome;
        return acc;
      }, {} as Record<number, string>),
    [componentes]
  );

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 shadow-sm"
        >
          Registrar Aula
        </button>
      </div>

      <div className="space-y-4">
        {aulasIniciais.map((aula) => (
          <div
            key={aula.id}
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">
                  {new Date(aula.data).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </p>
                <h3 className="font-bold text-slate-800 mt-1">
                  {aula.descricao}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
                  {nomeComponenteMap[aula.ComponenteTurmaId]}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-right">
              <Link
                to={`/turma/${turmaId}/aula/${aula.id}/presenca`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Lançar Presenças &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ModalNovaAula
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAdicionarAula}
        componentes={componentes}
      />
    </div>
  );
}
