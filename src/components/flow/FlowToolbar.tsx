import { useDnD } from "@/hooks/useDnD";
import { CrosshairIcon, GitFork, Plus, Search, Share2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useReactFlow } from "@xyflow/react";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { customNodes } from "@/lib/data";
import { TooltipIcon } from "./TooltipIcon";
import { useLayoutedElements } from "@/hooks/useLayoutedElements";

export function FlowToolbar() {
  return (
    <div className="mt-2 flex gap-2 bg-white h-[48px] px-4 py-2 shadow-lg rounded-xl border border-grey-400 items-center">
      <AddNodePopOver />
      <SearchButton />
      <FitViewTrigger />
      <Separator orientation="vertical" className="h-6" />
      <ShareButton />
      <ForkButton />
    </div>
  );
}

const AddNodePopOver = () => {
  const [, setType] = useDnD();
  const [isOpen, setIsOpen] = useState(false);

  const onDragStart = (event, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform`}
        >
          {isOpen ? <X size={28} /> : <TooltipIcon icon={<Plus size={28} />} tooltip="Add Node" />}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white shadow-lg rounded-lg"
        side="bottom"
        align="center"
        sideOffset={20}
      >
        <div className="grid grid-cols-4 gap-4 p-4">
          {Object.keys(customNodes)
            .sort((a, b) => customNodes[a].order - customNodes[b].order)
            .map((key, index) => {
              const node = customNodes[key];
              return (
                <div
                  key={index}
                  onDragStart={(event) => onDragStart(event, key)}
                  className="w-12 h-12 flex justify-center items-center cursor-grab transition-transform transform hover:scale-105"
                  draggable
                >
                  <TooltipIcon icon={<node.icon size={36} />} tooltip={node.name} sideOffset={2}/>
                </div>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FitViewTrigger = () => {
  const { fitView } = useReactFlow();
  const [, { toggle },] = useLayoutedElements();
  return (
    <TooltipIcon
      icon={<CrosshairIcon size={24} />}
      tooltip="Fit View"
      onClick={() => {
        toggle("on")
        setTimeout(() => {
          toggle("off")
          fitView({
            padding: 0.2,
            duration: 500,
          });
        }, 300);
      }}
    />
  );
};

const ShareButton = () => {
  return <TooltipIcon icon={<Share2 size={24} />} tooltip="Share" sideOffset={14} />;
};

const ForkButton = () => {
  return <TooltipIcon icon={<GitFork size={24} />} tooltip="Fork" sideOffset={14} />;
};

const SearchButton = () => {
  return <TooltipIcon icon={<Search size={24} />} tooltip="Search" sideOffset={14} />;
};



