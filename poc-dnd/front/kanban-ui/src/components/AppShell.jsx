import { roleLabel } from "../utils/auth";

export default function AppShell({ authStatus, children, currentUser, onLogoff }) {
  return (
    <main className="app">
      <nav className="topbar">
        <div className="topbar__brand">
          <span className="brand-mark brand-mark--small" aria-hidden="true">🐯</span>
          Tigre da Montanha
        </div>

        <div className="topbar__user">
          <div>
            <strong>{currentUser.nome || "Usuario"}</strong>
            <span>{roleLabel(currentUser.tipoConta)}</span>
          </div>
          <button className="button button--ghost" type="button" onClick={onLogoff}>
            Sair
          </button>
        </div>
      </nav>

      {children}

      {authStatus.message ? (
        <div className={`floating-status status--${authStatus.type}`}>{authStatus.message}</div>
      ) : null}
    </main>
  );
}
