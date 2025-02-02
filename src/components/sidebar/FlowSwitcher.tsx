import { ChartNetwork, ChevronsUpDown, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppState, FlowData } from "@/store/types";
import { useShallow } from "zustand/react/shallow";
import useStore from "@/store/store";
import { FlowDialog } from "../flow/FlowDialog";
import { Button } from "@/components/ui/button";

const selector = (state: AppState) => ({
  selectedFlow: state.selectedFlow,
  flows: state.flows,
  setSelectedFlow: state.setSelectedFlow,
  updateFlow: state.updateFlow,
  addFlow: state.addFlow,
});

export function FlowSwitcher() {
  const { isMobile } = useSidebar();
  const { flows, selectedFlow, setSelectedFlow, updateFlow, addFlow } = useStore(useShallow(selector));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'new' | 'edit'>('new');

  const handleAddFlow = (data: FlowData) => {
    addFlow(data);
    setDialogOpen(false);
  };

  const handleUpdateFlow = (data: FlowData) => {
    updateFlow(selectedFlow.id, data);
    setDialogOpen(false);
  };

  const handleNewFlow = () => {
    setDialogType('new');
    setDialogOpen(true);
  };

  const handleEditFlow = () => {
    setDialogType('edit');
    setDialogOpen(true);
  };

  return (
    <>
      <FlowDialog 
        type={dialogType}
        handler={dialogType === 'new' ? handleAddFlow : handleUpdateFlow}
        data={dialogType === 'edit' ? selectedFlow.data : undefined}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ChartNetwork className="size-4 grow-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{selectedFlow.data.title}</span>
                  <span className="truncate text-xs">{selectedFlow.data.description}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuItem className="gap-2 p-2">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{selectedFlow.data.title}</span>
                  <span className="truncate text-xs">{selectedFlow.data.description}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditFlow();
                  }}
                >
                  <Pencil />
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Flows</DropdownMenuLabel>
              {flows.map((flow, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setSelectedFlow(flow.id)}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <ChartNetwork className="size-4 grow-0" />
                  </div>
                  {flow.data.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2 cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  handleNewFlow();
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add Flow</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
