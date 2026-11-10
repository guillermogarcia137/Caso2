import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './utils/context';
import { Layout } from './components/Layout';
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Classroom = lazy(() => import('./pages/Classroom'));
const Quiz = lazy(() => import('./pages/Quiz'));
const CodeSubmission = lazy(() => import('./pages/CodeSubmission'));
const Certificates = lazy(() => import('./pages/Certificates'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const Forum = lazy(() => import('./pages/Forum'));
const Chat = lazy(() => import('./pages/Chat'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
/** Rutas hash para permitir enlaces directos en GitHub Pages sin reglas de servidor. */
export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Suspense
          fallback={<div className="app-loading">✦ Preparando tu espacio de aprendizaje…</div>}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/validar" element={<VerifyCertificate />} />
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="catalogo" element={<Catalog />} />
              <Route path="aula/:id" element={<Classroom />} />
              <Route path="examen/:id" element={<Quiz />} />
              <Route path="codigo/:id" element={<CodeSubmission />} />
              <Route path="certificados" element={<Certificates />} />
              <Route path="foro" element={<Forum />} />
              <Route path="chat" element={<Chat />} />
              <Route path="coordinacion" element={<AdminPanel />} />
              <Route
                path="*"
                element={
                  <div className="empty-state">
                    <h1>Este camino aún no existe</h1>
                    <Link to="/">Volver a mi aprendizaje</Link>
                  </div>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </AppProvider>
  );
}
