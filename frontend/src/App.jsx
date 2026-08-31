import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { AlunoTreinoPage } from "./pages/AlunoTreinoPage";
import { ProfessorPage } from "./pages/ProfessorPage";
import { AdminPage } from "./pages/AdminPage";
import { RecepcaoPage } from "./pages/RecepcaoPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route
          path="/meu-treino"
          element={
            <RequireAuth perfis={["ALUNO"]}>
              <AlunoTreinoPage />
            </RequireAuth>
          }
        />

        <Route
          path="/professor"
          element={
            <RequireAuth perfis={["PROFESSOR", "ADMIN"]}>
              <ProfessorPage />
            </RequireAuth>
          }
        />
        <Route
          path="/professor/alunos/:alunoId"
          element={
            <RequireAuth perfis={["PROFESSOR", "ADMIN"]}>
              <AlunoTreinoPage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth perfis={["ADMIN"]}>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/alunos/:alunoId"
          element={
            <RequireAuth perfis={["ADMIN"]}>
              <AlunoTreinoPage />
            </RequireAuth>
          }
        />

        <Route
          path="/recepcao"
          element={
            <RequireAuth perfis={["ATENDENTE"]}>
              <RecepcaoPage />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
