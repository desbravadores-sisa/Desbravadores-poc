import { INITIAL_LOGIN, INITIAL_REGISTER } from "../constants";
import { passwordStrength } from "../utils/auth";

export default function AuthPanel({
  authMode,
  authStatus,
  isAuthenticating,
  isRegistering,
  loginData,
  registerData,
  onLogin,
  onLoginChange,
  onModeChange,
  onRegister,
  onRegisterChange,
  onRoleChange
}) {
  const registerPasswordStrength = passwordStrength(registerData.senha);
  const isLogin = authMode === "login";

  return (
    <main className="app app--center">
      <section className="auth-panel">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">T</div>
          <div>
            <strong>Tigre da Montanha</strong>
            <span>Clube de Desbravadores</span>
          </div>
        </div>

        <h1>{isLogin ? "Acesso da POC" : "Criar conta"}</h1>
        <p>
          {isLogin
            ? "Diretores entram no painel de unidades; conselheiros entram no Kanban."
            : "Cadastre uma conta de diretor ou conselheiro para testar o fluxo."}
        </p>

        {isLogin ? (
          <LoginForm
            data={loginData}
            isSubmitting={isAuthenticating}
            onChange={onLoginChange}
            onSubmit={onLogin}
          />
        ) : (
          <RegisterForm
            data={registerData}
            isSubmitting={isRegistering}
            passwordInfo={registerPasswordStrength}
            onChange={onRegisterChange}
            onRoleChange={onRoleChange}
            onSubmit={onRegister}
          />
        )}

        <button
          className="auth-switch"
          type="button"
          onClick={() => onModeChange(isLogin ? "register" : "login")}
        >
          {isLogin ? "Nao tem conta? Cadastre-se" : "Ja tem conta? Entrar"}
        </button>

        {authStatus.message ? (
          <div className={`status status--${authStatus.type}`}>{authStatus.message}</div>
        ) : null}
      </section>
    </main>
  );
}

function LoginForm({ data = INITIAL_LOGIN, isSubmitting, onChange, onSubmit }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        <span>E-mail</span>
        <input
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          placeholder="seu@email.com"
          autoComplete="email"
        />
      </label>

      <label>
        <span>Senha</span>
        <input
          name="senha"
          type="password"
          value={data.senha}
          onChange={onChange}
          placeholder="Digite sua senha"
          autoComplete="current-password"
        />
      </label>

      <button className="button button--primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

function RegisterForm({
  data = INITIAL_REGISTER,
  isSubmitting,
  passwordInfo,
  onChange,
  onRoleChange,
  onSubmit
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        <span>Nome completo</span>
        <input
          name="nome"
          type="text"
          value={data.nome}
          onChange={onChange}
          placeholder="Seu nome"
          autoComplete="name"
        />
      </label>

      <label>
        <span>E-mail</span>
        <input
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          placeholder="seu@email.com"
          autoComplete="email"
        />
      </label>

      <div className="role-picker" aria-label="Tipo de conta">
        <button
          className={data.tipoConta === "DIRETOR" ? "role-picker__option active" : "role-picker__option"}
          type="button"
          onClick={() => onRoleChange("DIRETOR")}
        >
          Diretor
        </button>
        <button
          className={data.tipoConta === "CONSELHEIRO" ? "role-picker__option active" : "role-picker__option"}
          type="button"
          onClick={() => onRoleChange("CONSELHEIRO")}
        >
          Conselheiro
        </button>
      </div>

      <label>
        <span>Senha</span>
        <input
          name="senha"
          type="password"
          value={data.senha}
          onChange={onChange}
          placeholder="Digite sua senha"
          autoComplete="new-password"
        />
      </label>

      <div className={`password-meter password-meter--${passwordInfo.score}`}>
        <div className="password-meter__track">
          <div style={{ width: passwordInfo.percent }} />
        </div>
        <span>{passwordInfo.label}</span>
      </div>

      <label>
        <span>Confirmar senha</span>
        <input
          name="confirmarSenha"
          type="password"
          value={data.confirmarSenha}
          onChange={onChange}
          placeholder="Repita sua senha"
          autoComplete="new-password"
        />
      </label>

      <button className="button button--primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}
