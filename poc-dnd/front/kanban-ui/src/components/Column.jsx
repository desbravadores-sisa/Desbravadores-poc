import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";

const COLUMN_CLASS_BY_STATUS = {
  "A fazer": "column--todo",
  "Em andamento": "column--doing",
  "Em revisão": "column--review",
  "Concluído": "column--done"
};

export default function Column({ columnId, tasks }) {
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
    data: {
      type: "column"
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`column ${COLUMN_CLASS_BY_STATUS[columnId] || ""} ${isOver ? "column--over" : ""}`}
    >
      <div className="column__header">
        <h2>{columnId}</h2>
        <span>{tasks.length}</span>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="column__content">
          {tasks.map((task) => (
            <Card key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
