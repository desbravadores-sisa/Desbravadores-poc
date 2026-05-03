import { useEffect, useState } from "react";
import Board from "./components/Board";

const COLUMN_TITLES = ["A fazer", "Em andamento", "Em revisão", "Concluído"];
const INITIAL_LOGIN = {
  email: "",
  senha: ""
};

function createEmptyBoard() {
  return COLUMN_TITLES.reduce((accumulator, title) => {
    accumulator[title] = [];
    return accumulator;
  }, {});
}

function normalizeBoardData(data = {}) {
  return COLUMN_TITLES.reduce((accumulator, title) => {
    accumulator[title] = Array.isArray(data[title]) ? data[title] : [];
    return accumulator;
  }, {});
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState(INITIAL_LOGIN);
  const [authStatus, setAuthStatus] = useState({
    type: "",
    message: "",
    detail: ""
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [boardData, setBoardData] = useState(createEmptyBoard);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    async function loadKanban() {
      setIsLoading(true);

      try {
        const response = await fetch("/tarefas/kanban");

        if (response.status === 204) {
          setBoardData(createEmptyBoard());
          return;
        }

        if (!response.ok) {
          throw new Error("Falha ao carregar tarefas do Kanban.");
        }

        const data = await response.json();
        setBoardData(normalizeBoardData(data));
      } catch (error) {
        console.error("Erro ao buscar tarefas do Kanban:", error);
        setBoardData(createEmptyBoard());
      } finally {
        setIsLoading(false);
      }
    }

    loadKanban();
  }, [currentUser]);

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginData((currentLogin) => ({
      ...currentLogin,
      [name]: value
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (!loginData.email || !loginData.senha) {
      setAuthStatus({
        type: "error",
        message: "Preencha e-mail e senha.",
        detail: "Os dois campos são obrigatórios para acessar o quadro."
      });
      return;
    }

    setIsAuthenticating(true);
    setAuthStatus({
      type: "",
      message: "",
      detail: ""
    });

    try {
      const response = await fetch("/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        throw new Error("E-mail ou senha inválidos.");
      }

      const data = await response.json();
      setCurrentUser(data);
      setLoginData(INITIAL_LOGIN);
      setAuthStatus({
        type: "success",
        message: "Acesso liberado.",
        detail: `Bem-vindo, ${data.nome}.`
      });
    } catch (error) {
      setAuthStatus({
        type: "error",
        message: "Não foi possível entrar.",
        detail: error.message || "Verifique se a API está rodando."
      });
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function handleLogoff() {
    try {
      await fetch("/usuarios/logoff", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    } finally {
      setCurrentUser(null);
      setBoardData(createEmptyBoard());
      setAuthStatus({
        type: "success",
        message: "Sessão encerrada.",
        detail: "Entre novamente para voltar ao Kanban."
      });
    }
  }

  if (!currentUser) {
    return (
      <main className="app-shell app-shell--center">
        <div className="bg-canvas" />

        <section className="auth-card glass">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">T</div>
            <div>
              <strong>Tigre da Montanha</strong>
              <span>Clube de Desbravadores</span>
            </div>
          </div>

          <h1>Bem-vindo</h1>
          <p>Acesse o quadro Kanban de tarefas do clube.</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              <span>E-mail</span>
              <input
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="seu@email.com"
              />
            </label>

            <label>
              <span>Senha</span>
              <input
                name="senha"
                type="password"
                value={loginData.senha}
                onChange={handleLoginChange}
                placeholder="Digite sua senha"
              />
            </label>

            <button className="btn-primary" type="submit" disabled={isAuthenticating}>
              {isAuthenticating ? <span className="spinner" aria-hidden="true" /> : "Entrar"}
            </button>
          </form>

          {authStatus.message ? (
            <div className={`toast-inline toast-inline--${authStatus.type}`}>
              <strong>{authStatus.message}</strong>
              {authStatus.detail ? <span>{authStatus.detail}</span> : null}
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="bg-canvas" />

      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-brand__mark" aria-hidden="true">T</span>
          Tigre da Montanha
        </div>

        <div className="nav-user">
          <div className="nav-user-info">
            <div className="nav-user-name">{currentUser.nome || "Usuário"}</div>
            <div className="nav-user-role">{currentUser.tipoConta || "Sessão ativa"}</div>
          </div>
          <button className="btn-logoff" type="button" onClick={handleLogoff}>
            Sair
          </button>
        </div>
      </nav>

      <header className="dash-header">
        <div>
          <h1>Quadro de Tarefas</h1>
          <p>Arraste as tarefas entre as colunas para atualizar o Kanban.</p>
        </div>

        <div className="dash-summary glass-sm">
          <span>{Object.values(boardData).flat().length}</span>
          <strong>tarefas</strong>
        </div>
      </header>

      {isLoading ? (
        <div className="app__status glass">Carregando tarefas...</div>
      ) : (
        <Board
          columns={COLUMN_TITLES}
          boardData={boardData}
          setBoardData={setBoardData}
        />
      )}
    </main>
  );
}
