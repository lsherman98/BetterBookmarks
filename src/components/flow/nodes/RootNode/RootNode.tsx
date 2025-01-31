import useStore from "@/store/store";
import { AppNode, AppState } from "@/store/types";
import {
  Handle,
  NodeProps,
  Position,
  useNodeId,
  useStore as flowStore,
  NodeToolbar,
  Edge,
} from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { BaseNode } from "../../BaseNode";
import {
  NodeHeader,
  NodeHeaderAction,
  NodeHeaderActions,
  NodeHeaderIcon,
  NodeHeaderTitle,
} from "../../NodeHeader";
import { Info, PlusIcon, Target } from "lucide-react";
import { Placeholder } from "../../Placeholder";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { newToast } from "@/lib/utils";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  addNode: state.addNode,
  addEdge: state.addEdge,
  targetNode: state.targetNode,
});

export function RootNode({ selected, type }: NodeProps) {
  const id = useNodeId();
  const { targetNode, nodes, addNode, addEdge } = useStore(useShallow(selector));
  const showContent = flowStore((s) => s.transform[2] >= 0.9);

  const handleAddNode = useCallback(() => {
    if (!id) {
      newToast("destructive", "Something went wrong.");
      return;
    }
    const newNode: AppNode = {
      id: (nodes.length + 1).toString(),
      type: "default",
      data: { isNew: true },
      position: { x: 0, y: 0 },
    };
    const newEdge: Edge = {
      id: `${id}-${newNode.id}`,
      source: id,
      target: newNode.id,
      type: "floating",
    };
    addNode(newNode);
    addEdge(newEdge);
  }, [addEdge, addNode, id, nodes.length]);

  return (
    <BaseNode
      selected={selected}
      className={`min-w-[12rem] max-w-[16rem] ${
        id === targetNode ? "border-2 border-dashed border-blue-500" : ""
      }`}
    >
      <NodeHeader className="-mx-3 border-b">
        <NodeHeaderIcon>
          <Target />
        </NodeHeaderIcon>
        <NodeHeaderTitle>Start Here</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderAction variant="ghost" label={""}>
            <Info />
          </NodeHeaderAction>
        </NodeHeaderActions>
      </NodeHeader>
      <NodeToolbar position={Position.Bottom} className="space-x-2">
        <Button variant="outline" size="icon" onClick={handleAddNode}>
          <PlusIcon />
        </Button>
      </NodeToolbar>

      {showContent ? <div>root data</div> : <Placeholder nodeType={type} />}
      <Handle type="source" position={Position.Left} />
    </BaseNode>
  );
}
