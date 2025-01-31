import { useDnD } from "@/hooks/useDnD";
import { CrosshairIcon, GitFork, Link, Plus, Share2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useReactFlow } from "@xyflow/react";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function FlowToolbar() {
  return (
    <div className="mt-2 flex gap-2 bg-white h-[48px] w-[248px] px-4 py-2 shadow-lg rounded-xl border border-grey-400 items-center">
      <AddNodePopOver />
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
        className="w-80 p-4 px-4 bg-white shadow-lg rounded-lg"
        side="bottom"
        align="center"
        sideOffset={20}
      >
        <div className="grid grid-cols-4 space-2">
          <div
            onDragStart={(event) => onDragStart(event, "default")}
            className="cursor-grab flex items-center justify-center transition-transform transform hover:scale-105"
            draggable
          >
            <Link size={24} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FitViewTrigger = () => {
  const { fitView } = useReactFlow();
  return (
    <TooltipIcon
      icon={<CrosshairIcon size={24} />}
      tooltip="Fit View"
      onClick={() => {
        fitView({
          padding: 0.2,
          duration: 500,
        });
      }}
    />
  );
};

const ShareButton = () => {
  return <TooltipIcon icon={<Share2 size={24} />} tooltip="Share" />;
};

const ForkButton = () => {
  return <TooltipIcon icon={<GitFork size={24} />} tooltip="Fork" />;
};

type ToolbarButtonProps = {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
};

const TooltipIcon = ({ icon, tooltip, onClick }: ToolbarButtonProps) => (
  <Tooltip delayDuration={400}>
    <TooltipTrigger asChild>
      <div
        className="cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform"
        onClick={onClick}
      >
        {icon}
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={14}>
      {tooltip}
    </TooltipContent>
  </Tooltip>
);
