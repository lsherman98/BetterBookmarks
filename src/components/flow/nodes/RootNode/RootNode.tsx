import useStore from "@/store/store";
import { AppState } from "@/store/types";
import { Handle, NodeProps, Position, useNodeId, useStore as flowStore } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { BaseNode } from "../../BaseNode";
import {
  NodeHeader,
  NodeHeaderAction,
  NodeHeaderActions,
  NodeHeaderIcon,
  NodeHeaderTitle,
} from "../../NodeHeader";
import { Info, Target } from "lucide-react";
import { Placeholder } from "../../Placeholder";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  addNode: state.addNode,
  addEdge: state.addEdge,
  targetNode: state.targetNode,
});

export function RootNode({ selected, type }: NodeProps) {
  const id = useNodeId();
  const { targetNode } = useStore(useShallow(selector));
  const showContent = flowStore((s) => s.transform[2] >= 0.9);

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
      {showContent ? <div>root data</div> : <Placeholder nodeType={type} />}
      <Handle type="source" position={Position.Left} />
    </BaseNode>
  );
}
