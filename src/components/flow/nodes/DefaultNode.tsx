import { NodeProps, Node, useNodeId, Position, Handle, useReactFlow } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import {
  NodeHeader,
  NodeHeaderAction,
  NodeHeaderActions,
  NodeHeaderIcon,
  NodeHeaderTitle,
} from "../NodeHeader";
import { ExternalLink, Link } from "lucide-react";
import { AppState, NodeData } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import Toolbar from "../NodeTools";
import { useState } from "react";

const selector = (state: AppState) => ({
  deleteNode: state.deleteNode,
  targetNode: state.targetNode,
});

export function DefaultNode({ selected, data }: NodeProps<Node<NodeData>>) {
  const id = useNodeId();
  const { getZoom } = useReactFlow();
  const { targetNode } = useStore(useShallow(selector));
  const showContent = getZoom() >= 0.9;
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenURL = () => {
    window.open(data.url, "_blank");
  };

  return (
    <BaseNode
      selected={selected}
      className={id === targetNode ? "border-2 border-dashed border-blue-500" : ""}
    >
      <NodeHeader className="-mx-3 border-b">
        <NodeHeaderIcon>
          <Link />
        </NodeHeaderIcon>
        <NodeHeaderTitle>{data.title}</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderAction onClick={handleOpenURL} variant="ghost" label="Delete node">
            <ExternalLink />
          </NodeHeaderAction>
        </NodeHeaderActions>
      </NodeHeader>
      <Toolbar nodeId={id} isEditing={isEditing} setIsEditing={setIsEditing} />
      {showContent ? data.url : <Placeholder />}
      {isEditing && <div>Editing</div>}
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
