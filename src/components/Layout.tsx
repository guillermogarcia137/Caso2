import { NavLink, Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  MessagesSquare,
  MessageCircle,
  BarChart3,
  GitFork,
  Moon,
  Sun,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  LogOut,
  Search,
  Bell,
  Terminal,
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../utils/context';
export const REPOSITORY_URL = 'https://github.com/guillermogarcia137/Caso2';
/** Marca consistente en la navegación y las páginas públicas. */
export function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-icon">
        <GraduationCap size={24} />
      </span>
      <span>
        SkillTech<span className="brand-sub">ACADEMY</span>
      </span>
    </Link>
  );
}
/** Navegación lateral adaptada al perfil de la sesión simulada. */
export function Sidebar({ close }: { close: () => void }) {
  const { session, language, logout } = useApp();
  const english = language === 'EN';
  const items = [
    {
      to: '/',
      icon: LayoutDashboard,
      text: english ? 'My dashboard' : 'Mi aprendizaje',
      roles: ['Alumno', 'Tutor', 'Coordinador'],
    },
    {
      to: '/catalogo',
      icon: BookOpen,
      text: english ? 'Course catalog' : 'Explorar cursos',
      roles: ['Alumno', 'Tutor', 'Coordinador'],
    },
    {
      to: '/certificados',
      icon: GraduationCap,
      text: english ? 'Certificates' : 'Mis certificados',
      roles: ['Alumno'],
    },
    {
      to: '/foro',
      icon: MessagesSquare,
      text: english ? 'Community' : 'Comunidad',
      roles: ['Alumno', 'Tutor', 'Coordinador'],
    },
    {
      to: '/chat',
      icon: MessageCircle,
      text: english ? 'Tutor chat' : 'Chat con tutores',
      roles: ['Alumno', 'Tutor'],
    },
    {
      to: '/codigo/java',
      icon: Terminal,
      text: english ? 'Code lab' : 'Laboratorio de código',
      roles: ['Alumno', 'Tutor'],
    },
    {
      to: '/coordinacion',
      icon: BarChart3,
      text: english ? 'Coordination' : 'Coordinación',
      roles: ['Coordinador'],
    },
  ];
  return (
    <aside className="sidebar">
      <Brand />
      <div className="workspace">
        <span className="workspace-icon">S</span>
        <div>
          Tu espacio de formación
          <small>
            Plan Academy <span>PRO</span>
          </small>
        </div>
      </div>
      <p className="nav-label">{english ? 'WORKSPACE' : 'ESPACIO DE TRABAJO'}</p>
      <nav>
        {items
          .filter((item) => item.roles.includes(session?.role ?? 'Alumno'))
          .map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={close}>
              <item.icon size={19} />
              {item.text}
              {item.to === '/chat' && <span className="nav-count">2</span>}
            </NavLink>
          ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="mentor-card">
          <span>✦ Aprende. Construye. Crece.</span>
          <p>Tu próxima gran idea empieza con una nueva habilidad.</p>
          <Link to="/catalogo" onClick={close}>
            Encuentra tu curso <ArrowUpRight size={15} />
          </Link>
        </div>
        <a className="repo-link" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
          <GitFork size={18} />
          Repositorio · Caso 2<ArrowUpRight size={14} />
        </a>
        <Link className="repo-link" to="/validar" onClick={close}>
          <ShieldCheck size={18} />
          Validar certificado
        </Link>
        <div className="profile">
          <span className="avatar">GG</span>
          <div>
            <b>Guillermo García</b>
            <small>{session?.role} · Cuenta de demo</small>
          </div>
          <button className="icon-button" aria-label="Cerrar sesión" onClick={logout}>
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
/** Cabecera de la aplicación con ajustes accesibles. */
export function Navbar({ open }: { open: () => void }) {
  const { theme, toggleTheme, language, toggleLanguage } = useApp();
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState(false);
  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={open} aria-label="Abrir menú">
        <Menu />
      </button>
      <div className="breadcrumb">
        Academy <span>/</span>{' '}
        <b>
          {pathname === '/'
            ? 'Mi aprendizaje'
            : ({
                catalogo: 'Explorar cursos',
                aula: 'Aula virtual',
                examen: 'Evaluación',
                codigo: 'Laboratorio',
                certificados: 'Certificados',
                foro: 'Comunidad',
                chat: 'Tutorías',
                coordinacion: 'Coordinación',
              }[pathname.split('/')[1]] ?? 'Academy')}
        </b>
      </div>
      <div className="top-actions">
        <span className="demo-pill">
          <i /> Demo interactiva
        </span>
        <button className="icon-button" aria-label="Cambiar idioma" onClick={toggleLanguage}>
          {language}
        </button>
        <button className="icon-button" aria-label="Cambiar tema" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="notification-wrap">
          <button
            className="icon-button"
            aria-label="Notificaciones"
            onClick={() => setNotifications(!notifications)}
          >
            <Bell size={18} />
            <span className="notification-dot" />
          </button>
          {notifications && (
            <div className="notification-panel">
              <b>Tu próxima meta te espera</b>
              <p>Examen de Java · 18 de noviembre</p>
              <Link to="/examen/java" onClick={() => setNotifications(false)}>
                Ir al examen →
              </Link>
            </div>
          )}
        </div>
        <Link to="/catalogo" className="icon-button" aria-label="Buscar cursos">
          <Search size={18} />
        </Link>
      </div>
    </header>
  );
}
/** Estructura privada: la autenticación es una simulación de interfaz. */
export function Layout() {
  const { session, theme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!session) return <Navigate to="/login" replace />;
  return (
    <div className={`app ${theme}`}>
      <a
        href="#contenido"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('contenido')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      {mobileOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className={mobileOpen ? 'sidebar-container open' : 'sidebar-container'}>
        <button
          className="mobile-close icon-button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </button>
        <Sidebar close={() => setMobileOpen(false)} />
      </div>
      <div className="main-shell">
        <Navbar open={() => setMobileOpen(true)} />
        <main id="contenido" tabIndex={-1}>
          <Outlet />
        </main>
        <footer>
          © 2026 SkillTech Academy <span>Aprende a tu ritmo. Construye tu futuro.</span>
          <span>Prototipo académico · 1º DAM</span>
        </footer>
      </div>
    </div>
  );
}
