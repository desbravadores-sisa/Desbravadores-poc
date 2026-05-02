import { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Card from "./Card";
import Column from "./Column";

function findColumnIdByTaskId(boardData, taskId) {
  return Object.keys(boardData).find((columnId) =>
    boardData[columnId].some((task) => task.id === taskId)
  );
}

export default function Board({ columns, boardData, setBoardData }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const tasksById = useMemo(() => {
    return Object.values(boardData).flat().reduce((accumulator, task) => {
      accumulator[task.id] = task;
      return accumulator;
    }, {});
  }, [boardData]);

  async function updateTaskStatus(taskId, nextStatus) {
    try {
      const response = await fetch(`/tarefas/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status da tarefa.");
      }
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
    }
  }

  function handleDragStart(event) {
    setActiveTask(tasksById[event.active.id] || null);
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const sourceColumnId = findColumnIdByTaskId(boardData, active.id);
    const overType = over.data.current?.type;
    const destinationColumnId =
      overType === "column" ? over.id : findColumnIdByTaskId(boardData, over.id);

    if (!sourceColumnId || !destinationColumnId) {
      return;
    }

    const sourceTasks = boardData[sourceColumnId];
    const destinationTasks = boardData[destinationColumnId];
    const sourceIndex = sourceTasks.findIndex((task) => task.id === active.id);

    if (sourceIndex === -1) {
      return;
    }

    if (sourceColumnId === destinationColumnId) {
      const targetIndex =
        overType === "column"
          ? sourceTasks.length - 1
          : sourceTasks.findIndex((task) => task.id === over.id);

      if (targetIndex === -1 || sourceIndex === targetIndex) {
        return;
      }

      setBoardData((currentBoard) => ({
        ...currentBoard,
        [sourceColumnId]: arrayMove(currentBoard[sourceColumnId], sourceIndex, targetIndex)
      }));

      return;
    }

    const nextSourceTasks = [...sourceTasks];
    const nextDestinationTasks = [...destinationTasks];
    const [movedTask] = nextSourceTasks.splice(sourceIndex, 1);
    const targetIndex =
      overType === "column"
        ? nextDestinationTasks.length
        : nextDestinationTasks.findIndex((task) => task.id === over.id);

    nextDestinationTasks.splice(
      targetIndex >= 0 ? targetIndex : nextDestinationTasks.length,
      0,
      {
        ...movedTask,
        statusKanban: destinationColumnId
      }
    );

    setBoardData((currentBoard) => ({
      ...currentBoard,
      [sourceColumnId]: nextSourceTasks,
      [destinationColumnId]: nextDestinationTasks
    }));

    await updateTaskStatus(active.id, destinationColumnId);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {columns.map((columnId) => (
          <Column
            key={columnId}
            columnId={columnId}
            tasks={boardData[columnId] || []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <Card task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
