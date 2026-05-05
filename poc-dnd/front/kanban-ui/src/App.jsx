import { useEffect, useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import AuthPanel from "./components/AuthPanel";
import CounselorDashboard from "./components/CounselorDashboard";
import DirectorDashboard from "./components/DirectorDashboard";
import {
  DEFAULT_CLUBE_ID,
  INITIAL_LOGIN,
  INITIAL_REGISTER,
  NOTIFICATION_TIMEOUT_MS
} from "./constants";
import {
  getDirectorUnits,
  getKanbanBoard,
  loginUser,
  logoffUser,
  registerUser
} from "./services/api";
import { createEmptyBoard, normalizeBoardData } from "./utils/kanban";
import { isValidRole, normalizeRole } from "./utils/auth";

export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authStatus, setAuthStatus] = useState({ type: "", message: "" });
  const [boardData, setBoardData] = useState(createEmptyBoard);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginData, setLoginData] = useState(INITIAL_LOGIN);
  const [registerData, setRegisterData] = useState(INITIAL_REGISTER);
  const [units, setUnits] = useState([]);

  const currentRole = normalizeRole(currentUser?.tipoConta);
  const totalTasks = useMemo(() => Object.values(boardData).flat().length, [boardData]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (currentRole === "DIRETOR") {
      loadDirectorUnits();
      return;
    }

    if (currentRole === "CONSELHEIRO") {
      loadKanban();
    }
  }, [currentUser, currentRole]);

  useEffect(() => {
    if (!authStatus.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAuthStatus({ type: "", message: "" });
    }, NOTIFICATION_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [authStatus.message]);

  async function loadDirectorUnits() {
    setIsLoading(true);

    try {
      const data = await getDirectorUnits();
      setUnits(data || []);
    } catch (error) {
      if (error.status === 404) {
        setUnits([]);
      } else {
        console.error("Erro ao buscar unidades:", error);
        showStatus("error", "Nao foi possivel carregar o painel do diretor.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function loadKanban() {
    setIsLoading(true);

    try {
      const data = await getKanbanBoard();
      setBoardData(data ? normalizeBoardData(data) : createEmptyBoard());
    } catch (error) {
      console.error("Erro ao buscar tarefas do Kanban:", error);
      setBoardData(createEmptyBoard());
      showStatus("error", "Nao foi possivel carregar o Kanban.");
    } finally {
      setIsLoading(false);
    }
  }

  function showStatus(type, message) {
    setAuthStatus({ type, message });
  }

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginData((currentLogin) => ({
      ...currentLogin,
      [name]: value
    }));
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterData((currentRegister) => ({
      ...currentRegister,
      [name]: value
    }));
  }

  function handleRoleChange(tipoConta) {
    setRegisterData((currentRegister) => ({
      ...currentRegister,
      tipoConta
    }));
  }

  function switchAuthMode(nextMode) {
    setAuthMode(nextMode);
    setAuthStatus({ type: "", message: "" });
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (!loginData.email || !loginData.senha) {
      showStatus("error", "Preencha e-mail e senha.");
      return;
    }

    setIsAuthenticating(true);
    setAuthStatus({ type: "", message: "" });

    try {
      const data = await loginUser(loginData);
      const role = normalizeRole(data.tipoConta);

      if (!isValidRole(role)) {
        throw new Error("Tipo de conta sem tela configurada.");
      }

      setCurrentUser({
        ...data,
        tipoConta: role
      });
      setLoginData(INITIAL_LOGIN);
      showStatus("success", `Bem-vindo, ${data.nome}.`);
    } catch (error) {
      showStatus("error", error.message || "Verifique se a API esta rodando.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();

    const nome = registerData.nome.trim();
    const email = registerData.email.trim();
    const tipoConta = normalizeRole(registerData.tipoConta);

    if (!nome || !email || !registerData.senha || !registerData.confirmarSenha) {
      showStatus("error", "Preencha todos os campos do cadastro.");
      return;
    }

    if (registerData.senha !== registerData.confirmarSenha) {
      showStatus("error", "As senhas nao coincidem.");
      return;
    }

    if (!isValidRole(tipoConta)) {
      showStatus("error", "Selecione um tipo de conta valido.");
      return;
    }

    setIsRegistering(true);
    setAuthStatus({ type: "", message: "" });

    try {
      await registerUser({
        nome,
        email,
        senha: registerData.senha,
        tipoConta,
        idClube: DEFAULT_CLUBE_ID
      });

      setRegisterData(INITIAL_REGISTER);
      setLoginData({ email, senha: "" });
      setAuthMode("login");
      showStatus("success", "Conta criada. Entre com sua senha para continuar.");
    } catch (error) {
      showStatus("error", error.message || "Nao foi possivel criar a conta.");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleLogoff() {
    try {
      await logoffUser();
    } catch (error) {
      console.error("Erro ao encerrar sessao:", error);
    } finally {
      setCurrentUser(null);
      setBoardData(createEmptyBoard());
      setUnits([]);
      showStatus("success", "Sessao encerrada.");
    }
  }

  if (!currentUser) {
    return (
      <AuthPanel
        authMode={authMode}
        authStatus={authStatus}
        isAuthenticating={isAuthenticating}
        isRegistering={isRegistering}
        loginData={loginData}
        registerData={registerData}
        onLogin={handleLogin}
        onLoginChange={handleLoginChange}
        onModeChange={switchAuthMode}
        onRegister={handleRegister}
        onRegisterChange={handleRegisterChange}
        onRoleChange={handleRoleChange}
      />
    );
  }

  return (
    <AppShell
      authStatus={authStatus}
      currentUser={currentUser}
      onLogoff={handleLogoff}
    >
      {currentRole === "DIRETOR" ? (
        <DirectorDashboard units={units} isLoading={isLoading} />
      ) : (
        <CounselorDashboard
          boardData={boardData}
          isLoading={isLoading}
          setBoardData={setBoardData}
          totalTasks={totalTasks}
        />
      )}
    </AppShell>
  );
}
