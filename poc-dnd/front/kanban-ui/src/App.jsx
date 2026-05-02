import { useEffect, useState } from "react";
import Board from "./components/Board";

const COLUMN_TITLES = ["A fazer", "Em andamento", "Em revisão", "Concluído"];

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
  const [boardData, setBoardData] = useState(createEmptyBoard);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Kanban</h1>
        <p>Arraste as tarefas entre as colunas.</p>
      </header>

      {isLoading ? (
        <div className="app__status">Carregando tarefas...</div>
      ) : (
        <Board
          columns={COLUMN_TITLES}
          boardData={boardData}
          setBoardData={setBoardData}
        />
      )}
    </div>
  );
}
