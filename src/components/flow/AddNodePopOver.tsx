import { useDnD } from "@/hooks/useDnD";
import { CrosshairIcon, Plus, Youtube } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useReactFlow } from "@xyflow/react";

export function FlowToolbar() {
  return (
    <div className="mt-2 flex gap-2 bg-white w-[248px] px-4 py-2 shadow-lg rounded-xl border border-grey-400">
      <FitViewTrigger />
      <AddNodePopOver />
    </div>
  );
}

const AddNodePopOver = () => {
  const [, setType] = useDnD();

  const onDragStart = (event, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform">
          <Plus size={28} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="mt-4 w-80 p-4 px-4 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-4 space-2">
          <div
            onDragStart={(event) => onDragStart(event, "default")}
            className="cursor-grab flex items-center justify-center transition-transform transform hover:scale-105"
            draggable
          >
            <Youtube color="red" size={48} />
          </div>
          <div
            onDragStart={(event) => onDragStart(event, "default")}
            className="cursor-grab flex items-center justify-center transition-transform transform hover:scale-105"
            draggable
          >
            <Youtube color="red" size={48} />
          </div>
          <div
            onDragStart={(event) => onDragStart(event, "default")}
            className="cursor-grab flex items-center justify-center transition-transform transform hover:scale-105"
            draggable
          >
            <Youtube color="red" size={48} />
          </div>
          <div
            onDragStart={(event) => onDragStart(event, "default")}
            className="cursor-grab flex items-center justify-center transition-transform transform hover:scale-105"
            draggable
          >
            <Youtube color="red" size={48} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FitViewTrigger = () => {
  const { fitView } = useReactFlow();
  return (
    <div
      className="cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform"
      onClick={() => {
        fitView({
          padding: 0.2,
          duration: 500,
        });
      }}
    >
      <CrosshairIcon size={24} />
    </div>
  );
};
