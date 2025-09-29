export type Store = {
  token: string;
};

export type Actions = {
  setToken: (token: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export interface ApiResponseItem {
  id: number;
  componente: {
    id: number;
    nome: string;
  };
  Atividades: {
    titulo: any;
    id: number;
    ComponenteTurmaId: number;
    peso: number;
    dataLimite: string;
    tipo: string;
  }[];
}

export interface ComponenteCurricular {
  id: number;
  nome: string;
}

export interface Tarefa {
  id: number;
  titulo: string;
  ComponenteTurmaId: number;
  peso: number;
  dataLimite: string;
  tipo: string;
  componente: ComponenteCurricular;
}

export interface Aluno {
  id: number;
  nome: string;
}

export interface Aula {
  id: number;
  data: string; // Formato "YYYY-MM-DD"
  descricao: string;
  ComponenteTurmaId: number;
  cargahoraria: number;
}
