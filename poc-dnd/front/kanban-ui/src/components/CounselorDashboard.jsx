import { COLUMN_TITLES } from "../constants";
import Board from "./Board";

export default function CounselorDashboard({ boardData, isLoading, setBoardData, totalTasks }) {
  return (
    <>
      <header className="app__header">
        <div>
          <h1>Quadro de Tarefas</h1>
          <p>Arraste as tarefas entre as colunas para atualizar o Kanban.</p>
        </div>
        <div className="summary-card">
          <strong>{totalTasks}</strong>
          <span>tarefas</span>
        </div>
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
    </>
  );
}
