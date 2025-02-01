import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ToolbarButtonProps = {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  sideOffset?: number;
};

export const TooltipIcon = ({ icon, tooltip, onClick, sideOffset }: ToolbarButtonProps) => (
  <Tooltip delayDuration={400}>
    <TooltipTrigger asChild>
      <div
        className="cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform"
        onClick={onClick}
      >
        {icon}
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={sideOffset}>
      {tooltip}
    </TooltipContent>
  </Tooltip>
);
