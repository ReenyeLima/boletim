import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './globals.css';
import ProtectedRoute from './services/protectedroute'

import Home from './pages/index';
import DashboardDocente from './pages/dashboarddocente';
import TurmaPage from './pages/turmapage';
import AtividadePage from './pages/atividadepage';
import PresencaPage from './pages/presencapage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardDocente />
      },
      {
        path: "/turma/:turmaId",
        element: <TurmaPage />
      },
      {
        path: "/turma/:turmaId/atividade/:atividadeId",
        element: <AtividadePage />
      },
      {
        path: "/turma/:turmaId/aula/:aulaId/presenca",
        element: <PresencaPage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
