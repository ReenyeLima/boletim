import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ComponenteCurricular, Tarefa } from "@/lib/utils/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // A prop onSave continua esperando os dados com os tipos corretos
  onSave: (data: Omit<Tarefa, "id">) => void;
  componentes: ComponenteCurricular[];
}

// O schema não muda, ele continua validando a entrada do formulário (strings)
const formSchema = z.object({
  titulo: z.string().min(3, "O título é obrigatório."),
  ComponenteTurmaId: z.string().min(1, "Selecione um componente curricular."),
  tipo: z.string().min(1, "Selecione um tipo de atividade."),
  peso: z.string().min(1, "O peso é obrigatório."),
  dataEntrega: z.string().min(1, "A data de entrega é obrigatória."),
});

type FormInputs = z.infer<typeof formSchema>;

export function ModalNovaTarefa({
  isOpen,
  onClose,
  onSave,
  componentes,
}: ModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  if (!isOpen) return null;

  // A CORREÇÃO ESTÁ AQUI
  const handleFormSubmit = (data: FormInputs) => {
    const componenteIdNumber = parseInt(data.ComponenteTurmaId, 10);

    // 1. Encontrar o objeto do componente completo usando o ID do formulário
    const selectedComponent = componentes.find(
      (c) => c.id === componenteIdNumber
    );

    // 2. Medida de segurança: se o componente não for encontrado, não continue.
    if (!selectedComponent) {
      console.error(
        "Componente selecionado não encontrado. Verifique os dados."
      );
      // O ideal seria mostrar um erro para o usuário aqui.
      return;
    }

    // 3. Montar o objeto final que corresponde EXATAMENTE ao tipo Tarefa
    const finalData = {
      titulo: data.titulo,
      ComponenteTurmaId: componenteIdNumber,
      tipo: data.tipo,
      peso: parseFloat(data.peso),
      dataLimite: data.dataEntrega,
      componente: selectedComponent, // 4. Adicionar a propriedade 'componente' que faltava
    };

    // Agora `finalData` tem a forma exata que `onSave` espera.
    onSave(finalData);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Adicionar Nova Atividade
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
                htmlFor="componenteId"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Componente Curricular
              </label>
              <select
                id="componenteId"
                {...register("ComponenteTurmaId")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Selecione...</option>
                {componentes.map((comp) => {
                  return (
                    <option key={comp.id} value={comp.id}>
                      {comp.nome}
                    </option>
                  );
                })}
              </select>
              {errors.ComponenteTurmaId && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.ComponenteTurmaId.message}
                </p>
              )}
            </div>

            {/* CAMPO TÍTULO ADICIONADO NOVAMENTE */}
            <div>
              <label
                htmlFor="titulo"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Título da Atividade
              </label>
              <input
                id="titulo"
                {...register("titulo")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {errors.titulo && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.titulo.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Tipo
                </label>
                <select
                  id="tipo"
                  {...register("tipo")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="SOM">Somativa</option>
                  <option value="FOR">Formativa</option>
                  <option value="DIAG">Diagnóstica</option>
                </select>
                {errors.tipo && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.tipo.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="peso"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Peso
                </label>
                <input
                  id="peso"
                  type="number"
                  step="0.5"
                  {...register("peso")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                {errors.peso && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.peso.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="dataEntrega"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Data de Entrega
              </label>
              <input
                id="dataEntrega"
                type="date"
                {...register("dataEntrega")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {errors.dataEntrega && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.dataEntrega.message}
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
              Salvar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
