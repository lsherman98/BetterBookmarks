import useStore from "@/store/store";
import { AppState } from "@/store/types";
import { Handle, NodeProps, Position, useNodeId, useStore as flowStore } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { BaseNode } from "../../BaseNode";
import { NodeHeader, NodeHeaderIcon, NodeHeaderTitle } from "../../NodeHeader";
import { Target } from "lucide-react";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  addNode: state.addNode,
  addEdge: state.addEdge,
  targetNode: state.targetNode,
});

export function RootNode({ selected }: NodeProps) {
  const id = useNodeId();
  const { targetNode } = useStore(useShallow(selector));
  const showContent = flowStore((s) => s.transform[2] >= 0.9);

  return showContent ? (
    <BaseNode
      selected={selected}
      className={`min-w-[12rem] max-w-[16rem] shadow-md rounded-md bg-white border-2 border-stone-400 ${
        id === targetNode ? "border-4 border-dashed border-blue-300" : ""
      }`}
    >
      <NodeHeader className="-mx-3 border-b">
        <NodeHeaderIcon>
          <Target />
        </NodeHeaderIcon>
        <NodeHeaderTitle>Root</NodeHeaderTitle>
      </NodeHeader>
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-gray-500 text-sm text-center">
        Drag in a bookmark from the toolbar to begin!
      </div>
      <Handle type="source" position={Position.Left} />
    </BaseNode>
  ) : (
    <BaseNode
      selected={selected}
      className={`min-w-[8rem] shadow-md rounded-md bg-white border-2 border-stone-400 ${
        id === targetNode ? "border-4 border-dashed border-blue-300" : ""
      }`}
    >
      <div className="flex items-center justify-center p-2 gap-2 text-lg">
        <Target />
        START
      </div>
      <Handle type="source" position={Position.Left} />
    </BaseNode>
  );
}
