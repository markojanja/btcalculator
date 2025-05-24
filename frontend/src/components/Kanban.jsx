import "./Kanban.css";
import KanbanColumn from "./KanbanColumn";

const Kanban = ({ setTaskModal }) => {
  return (
    <div className="kanban-wrapper">
      <KanbanColumn setTaskModal={setTaskModal} name={"todo"} />
      <KanbanColumn setTaskModal={setTaskModal} name={"in progress"} />
      <KanbanColumn setTaskModal={setTaskModal} name={"completed"} />
      <KanbanColumn setTaskModal={setTaskModal} name={"CS ticket"} />
      <KanbanColumn setTaskModal={setTaskModal} name={"IT ticket"} />
    </div>
  );
};

export default Kanban;
