import React from "react";
import { Button } from "../ui/button";
import { CrosshairIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";

export const FitViewTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { fitView } = useReactFlow();
  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        fitView({
          padding: 0.2,
          duration: 500,
        })
      }}
      {...props}
    >
      <CrosshairIcon />
      <span className="sr-only">Fit View</span>
    </Button>
  );
});
FitViewTrigger.displayName = "SidebarTrigger";
