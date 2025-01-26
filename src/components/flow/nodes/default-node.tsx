import {
  NodeProps,
  Node,
  useNodeId,
  Position,
  Handle,
  NodeToolbar,
  useReactFlow,
} from "@xyflow/react";
import { BaseNode } from "../base-node";
import {
  NodeHeader,
  NodeHeaderAction,
  NodeHeaderActions,
  NodeHeaderIcon,
  NodeHeaderMenuAction,
  NodeHeaderTitle,
} from "../node-header";
import { Rocket, Trash } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@/hooks/use-toast";

const selector = (state: AppState) => ({
  deleteNode: state.deleteNode,
  targetNode: state.targetNode,
});

export function DefaultNode({
  selected,
  data,
}: NodeProps<Node<{ label: string; title: string; intersecting: boolean }>>) {
  const id = useNodeId();
  const { getZoom } = useReactFlow();
  const { deleteNode, targetNode } = useStore(useShallow(selector));
  const { toast } = useToast();
  const showContent = getZoom() >= 0.9;

  const handleDelete = useCallback(() => {
    if (!id) {
      toast({
        variant: "destructive",
        description: "Node ID is missing",
      });
      return;
    }
    deleteNode(id);
  }, []);

  return (
    <BaseNode selected={selected} className={id === targetNode ? "border-2 border-dashed border-blue-500" : ""}>
      <NodeHeader className="-mx-3 -mt-2 border-b">
        <NodeHeaderIcon>
          <Rocket />
        </NodeHeaderIcon>
        <NodeHeaderTitle>{data.title}</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderMenuAction label="Expand account options">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </NodeHeaderMenuAction>
          <NodeHeaderAction onClick={handleDelete} variant="ghost" label="Delete node">
            <Trash />
          </NodeHeaderAction>
        </NodeHeaderActions>
      </NodeHeader>
      <NodeToolbar position={Position.Bottom}>
        <button>cut</button>
        <button>copy</button>
        <button>paste</button>
      </NodeToolbar>
      {showContent ? data.label : <Placeholder />}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </BaseNode>
  );
}

const Placeholder = () => (
  <div className="placeholder">
    <div />
    <div />
    <div />
  </div>
);
