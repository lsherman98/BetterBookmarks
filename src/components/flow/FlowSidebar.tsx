import { useDnD } from "@/hooks/useDnD";

export function FlowSidebar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType : string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="border-r border-gray-200 p-4 text-xs bg-gray-50">
      <div className="mb-10">You can drag these nodes to the pane on the right.</div>
      <div
        className="h-5 p-1 border border-gray-800 rounded mb-2 flex justify-center items-center cursor-grab"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Input Node
      </div>
      <div
        className="h-5 p-1 border border-gray-800 rounded mb-2 flex justify-center items-center cursor-grab"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className="h-5 p-1 border border-gray-800 rounded mb-2 flex justify-center items-center cursor-grab"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Output Node
      </div>
    </aside>
  );
};
