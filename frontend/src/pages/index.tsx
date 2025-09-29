import { useEffect, useState } from "react";

import { useAuthStore } from "@/lib/store/authStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/services/api";

import logo from "@/assets/sesi-senai.png";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O e-mail é obrigatório." })
    .email({ message: "Formato de e-mail inválido." })
    .transform((value) => value.toLowerCase()), // Boa prática: normalizar o e-mail
  password: z
    .string()
    .min(4, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register, // Função para registrar os inputs
    handleSubmit, // Wrapper para o nosso submit
    formState: { errors }, // Objeto com os erros de validação
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema), // Conecta o Zod
  });

  useEffect(() => {
    useAuthStore.getState().logout();
  }, []);

  const handleLogin = (data: LoginFormInputs) => {
    api
      .post("/auth/login", data)
      .then((resp) => {
        if (resp.status === 201) {
          useAuthStore.getState().setToken(resp.data.token);
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Cabeçalho */}
        <div className="px-6 pt-6 text-center">
          <div className="px-6 pt-6 text-center">
            <div className="mx-auto mb-3 flex items-center justify-center">
              <img src={logo} alt="logo sesi senai" />
            </div>
            <h1 className="text-2xl font-bold">Portal Acadêmico</h1>
            <p className="text-slate-600 text-sm">
              SESI / SENAI — Controle de alunos (tarefas, presença e notas)
            </p>
          </div>

          {/* Formulário (apenas estrutura) */}
          <form
            className="px-6 py-6 space-y-4"
            onSubmit={handleSubmit(handleLogin)}
          >
            {/* E-mail */}
            <div className="flex flex-col items-start">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                E-mail institucional
              </label>
              <input
                id="email"
                type="email"
                placeholder="nome.sobrenome@senaisp.edu.br"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200"
                // RHF PASSO 5: Registrar o campo. Isso substitui value e onChange.
                {...register("email")}
              />
              {/* RHF PASSO 6: Exibir a mensagem de erro */}
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Senha
                </label>
                <a href="#" className="text-xs text-slate-600 hover:underline">
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-200 pr-24"
                  // RHF PASSO 5: Registrar o campo de senha.
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {/* RHF PASSO 6: Exibir a mensagem de erro */}
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 self-start">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Lembrar de mim */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                defaultChecked
                className="accent-slate-900"
              />
              <label htmlFor="remember" className="text-sm text-slate-700">
                Manter conectado
              </label>
            </div>

            {/* Botão de envio (ainda sem ação real) */}
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-95 focus:ring-4 focus:ring-slate-200 cursor-pointer"
            >
              Entrar
            </button>

            {/* Aviso legal */}
            <p className="text-center text-xs text-slate-500">
              Ao continuar, você concorda com os termos de uso e política de
              privacidade.
            </p>
          </form>

          {/* Rodapé */}
          <div className="px-6 pb-6">
            <hr className="border-slate-200 my-2" />
            <p className="text-xs text-center text-slate-500">
              © {new Date().getFullYear()} SESI/SENAI — Sistema Acadêmico
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
