import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";

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
      className={`column ${isOver ? "column--over" : ""}`}
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
