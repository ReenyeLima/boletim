import logo from "@/assets/sesi-senai.png";

import { useAuthStore } from "@/lib/store/authStore";

import { useNavigate } from "react-router-dom";

import jwt from "@/services/jwt";

export function Sidebar() {
  const navigate = useNavigate();

  const userData = jwt.decodeToken(useAuthStore.getState().token);

  const nomeDocente = userData.nome;

  const logoff = () => {
    useAuthStore.getState().logout();
    navigate("/");
  };

  const goto = () => {
    navigate("/dashboard");
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Cabeçalho do Menu */}
      <div className="p-6 text-center border-b border-slate-700">
        <img src={logo} alt="Logo SESI SENAI" className="mx-auto mb-3" />
        <h2 className="text-xl font-bold">Portal do Docente</h2>
        <p className="text-sm text-slate-400 mt-2">Bem-vinda, {nomeDocente}</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <a
              onClick={goto}
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span>Minhas Turmas</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span>Calendário Letivo</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span>Página Inicial</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logoff}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-md hover:bg-red-500 transition-colors"
        >
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
