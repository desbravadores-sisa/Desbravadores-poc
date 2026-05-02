import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

function formatDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

function CardContent({ task }) {
  const prazoEntrega = formatDate(task.prazoEntrega);

  return (
    <>
      <h3 className="card__title">{task.nome}</h3>

      {task.descricao ? <p className="card__description">{task.descricao}</p> : null}

      <div className="card__meta">
        {typeof task.pontuacao === "number" ? <span>{task.pontuacao} pts</span> : null}
        {prazoEntrega ? <span>Prazo: {prazoEntrega}</span> : null}
      </div>
    </>
  );
}

export default function Card({ task, isOverlay = false }) {
  if (isOverlay) {
    return (
      <article className="card card--overlay">
        <CardContent task={task} />
      </article>
    );
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "card",
        task
      }
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? "card--dragging" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardContent task={task} />
    </article>
  );
}
