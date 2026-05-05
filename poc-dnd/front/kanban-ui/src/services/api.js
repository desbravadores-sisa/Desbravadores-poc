async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = new Error("Falha na comunicacao com a API.");
    error.status = response.status;
    throw error;
  }

  return parseResponse(response);
}

export function loginUser(credentials) {
  return request("/usuarios/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function registerUser(payload) {
  return request("/usuarios/cadastro", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logoffUser() {
  return request("/usuarios/logoff", {
    method: "POST"
  });
}

export function getDirectorUnits() {
  return request("/unidades/diretor");
}

export function getCounselorUnit() {
  return request("/unidades/conselheiro");
}

export function getKanbanBoard() {
  return request("/tarefas/kanban");
}

export function updateTaskStatus(taskId, nextStatus) {
  return request(`/tarefas/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status: nextStatus
    })
  });
}
