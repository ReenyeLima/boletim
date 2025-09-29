// src/components/ModalNovaAula.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ComponenteCurricular, Aula } from "@/lib/utils/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave ainda espera os dados com os tipos corretos (componenteId como number)
  onSave: (data: Omit<Aula, "id">) => void;
  componentes: ComponenteCurricular[];
}

// 1. Schema que valida APENAS STRINGS, como elas vêm do formulário.
const formSchema = z.object({
  ComponenteTurmaId: z.string().min(1, "Selecione um componente curricular."),
  data: z.string().min(1, "A data da aula é obrigatória."),
  descricao: z
    .string()
    .min(3, "A descrição é obrigatória.")
    .max(200, "Máximo de 200 caracteres."),
});

// 2. O tipo inferido é de um formulário com apenas strings.
type FormInputs = z.infer<typeof formSchema>;

export function ModalNovaAula({
  isOpen,
  onClose,
  onSave,
  componentes,
}: ModalProps) {
  // 3. useForm é tipado com o tipo de strings (FormInputs), o que resolve o erro.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  if (!isOpen) return null;

  // 4. A transformação manual dos dados acontece aqui!
  const handleFormSubmit = (data: FormInputs) => {
    // Convertemos manualmente a string 'componenteId' para o tipo 'number'.
    const processedData = {
      descricao: data.descricao,
      data: data.data,
      ComponenteTurmaId: parseInt(data.ComponenteTurmaId, 10),
      cargahoraria: 4,
    };

    // Enviamos os dados já processados e com os tipos corretos para a função onSave.
    onSave(processedData);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Registrar Nova Aula
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl text-slate-500 hover:text-slate-800"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="aula-componenteId"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Componente Curricular
              </label>
              <select
                id="aula-componenteId"
                {...register("ComponenteTurmaId")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {componentes.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.nome}
                  </option>
                ))}
              </select>
              {errors.ComponenteTurmaId && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.ComponenteTurmaId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="aula-data"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Data da Aula
              </label>
              <input
                id="aula-data"
                type="date"
                {...register("data")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {errors.data && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.data.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="aula-descricao"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Descrição do Conteúdo
              </label>
              <textarea
                id="aula-descricao"
                {...register("descricao")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[80px]"
                placeholder="Ex: Revisão de JOINs e início de Subqueries..."
              ></textarea>
              {errors.descricao && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.descricao.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 text-slate-700 font-medium px-4 py-2 rounded-lg hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-slate-900 text-white font-medium px-4 py-2 rounded-lg hover:opacity-90"
            >
              Salvar Aula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
