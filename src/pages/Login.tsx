import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Code2, GitFork, Check } from 'lucide-react';
import { Brand, REPOSITORY_URL } from '../components/Layout';
import { useApp, type Role } from '../utils/context';
/** Registro y acceso de demostración; las contraseñas nunca se almacenan. */
export default function Login() {
  const { session, login, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('guillermo@skilltech.demo');
  const [role, setRole] = useState<Role>('Alumno');
  const [code, setCode] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (step === 1) setStep(2);
    else {
      login(role, email);
      navigate(role === 'Coordinador' ? '/coordinacion' : '/');
    }
  };
  if (session) return <Navigate to="/" replace />;
  return (
    <div className={`public-page ${theme}`}>
      <header className="public-header">
        <Brand />
        <div>
          <Link to="/validar">Validar un certificado</Link>
          <button className="button small secondary" onClick={toggleTheme}>
            Cambiar tema
          </button>
        </div>
      </header>
      <div className="login-grid">
        <section className="login-story">
          <span className="eyebrow">EL CONOCIMIENTO CAMBIA TU FUTURO</span>
          <h1>
            Tu siguiente
            <br />
            versión empieza
            <br />
            <span>aquí.</span>
          </h1>
          <p>
            Programación, ciberseguridad, cloud y datos.
            <br />
            Aprende haciendo, con personas que te acompañan.
          </p>
          <div className="login-code">
            <Code2 size={42} />
            <code>
              while (curiosidad) {'{'}
              <br />
              &nbsp; aprender();
              <br />
              &nbsp; construir();
              <br />
              {'}'}
            </code>
            <span>✦ HAZ QUE SUCEDA</span>
          </div>
          <div className="login-benefits">
            <span>
              <Check size={17} /> A tu ritmo
            </span>
            <span>
              <Check size={17} /> Tutores expertos
            </span>
            <span>
              <Check size={17} /> Certificados
            </span>
          </div>
        </section>
        <section className="login-panel">
          <span className="tag violet">PROTOTIPO · CASO 2</span>
          <h2>
            {step === 2
              ? 'Un paso más de seguridad'
              : register
                ? 'Empieza tu camino'
                : 'Qué bueno verte por aquí'}
          </h2>
          <p>
            {step === 2
              ? 'Introduce cualquier código de 6 dígitos para entrar.'
              : 'Tu espacio para aprender, practicar y crecer.'}
          </p>
          <form onSubmit={submit}>
            {step === 1 ? (
              <>
                {register && (
                  <label>
                    Nombre completo
                    <input required placeholder="Tu nombre" autoComplete="name" />
                  </label>
                )}
                <label>
                  Tu perfil
                  <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                    {['Alumno', 'Tutor', 'Coordinador'].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Correo electrónico
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </label>
                <label>
                  Contraseña
                  <input
                    type="password"
                    required
                    minLength={4}
                    placeholder="Cualquier contraseña de 4 caracteres"
                    autoComplete={register ? 'new-password' : 'current-password'}
                  />
                </label>
                <button className="button full" type="submit">
                  {register ? 'Crear cuenta de demo' : 'Iniciar sesión'}
                  <ArrowRight size={17} />
                </button>
                <div className="divider">o continúa con</div>
                <button className="button secondary full" type="button" onClick={() => setStep(2)}>
                  <b className="google-mark">G</b> Entrar con Google <small>(simulado)</small>
                </button>
              </>
            ) : (
              <>
                <span className="verify-icon">
                  <ShieldCheck size={32} />
                </span>
                <label>
                  Código de verificación
                  <input
                    autoFocus
                    className="otp"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    autoComplete="one-time-code"
                  />
                </label>
                <button className="button full" type="submit">
                  Verificar y entrar <ArrowRight size={17} />
                </button>
                <button className="button ghost full" type="button" onClick={() => setStep(1)}>
                  Volver
                </button>
              </>
            )}
          </form>
          <p className="login-switch">
            {register ? '¿Ya tienes cuenta?' : '¿Primera vez por aquí?'}{' '}
            <button
              onClick={() => {
                setRegister(!register);
                setStep(1);
              }}
            >
              {register ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
          <div className="demo-note">
            <ShieldCheck size={18} />
            <p>Acceso simulado para la presentación. No introduzcas contraseñas ni datos reales.</p>
          </div>
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer" className="repo-link">
            <GitFork size={17} /> Ver proyecto en GitHub <ArrowRight size={14} />
          </a>
        </section>
      </div>
    </div>
  );
}
