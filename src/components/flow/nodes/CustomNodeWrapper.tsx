import { NodeProps, Node, useNodeId, Position, Handle, useStore as flowStore } from "@xyflow/react";
import { BaseNode } from "../BaseNode";
import {
  NodeHeader,
  NodeHeaderAction,
  NodeHeaderActions,
  NodeHeaderIcon,
  NodeHeaderTitle,
} from "../NodeHeader";
import { ExternalLink } from "lucide-react";
import { AppState, NodeData } from "@/store/types";
import { useShallow } from "zustand/react/shallow";
import Toolbar from "../NodeToolbar";
import { useEffect, useState } from "react";
import useStore from "@/store/store";
import { Placeholder } from "../Placeholder";
import { newToast } from "@/lib/utils";
import { customNodes } from "@/lib/data";

const selector = (state: AppState) => ({
  deleteNode: state.deleteNode,
  targetNode: state.targetNode,
  updateNode: state.updateNode,
  selectNode: state.selectNode,
});

export function CustomNodeWrapper({
  selected,
  type,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<Node<NodeData>>) {
  const id = useNodeId();
  const position = { x: positionAbsoluteX + 200, y: positionAbsoluteY + 200 };
  const { targetNode, updateNode, selectNode } = useStore(useShallow(selector));
  const showContent = flowStore((s) => s.transform[2] >= 0.9);
  const [isEditing, setIsEditing] = useState(false);
  const component = customNodes[type];

  const handleOpenURL = () => {
    window.open(data.url, "_blank");
  };

  const handleUpdateNode = (data: NodeData) => {
    if (!id) {
      newToast("destructive", "Something went wrong.");
      return;
    }
    updateNode(id, data);
  };

  useEffect(() => {
    if (!selected && isEditing) {
      setIsEditing(false);
    }
  }, [selected, isEditing]);

  useEffect(() => {
    if (data.isNew) {
      setIsEditing(true);
      if (id) selectNode(id);
    }
    handleUpdateNode({ ...data, isNew: false });
  }, []);

  return (
    <BaseNode
      selected={selected}
      className={`min-w-[12rem] max-w-[16rem] ${
        id === targetNode ? "border-2 border-dashed border-blue-500" : ""
      }`}
    >
      <NodeHeader className="-mx-3 border-b">
        <NodeHeaderIcon>{<component.icon />}</NodeHeaderIcon>
        <NodeHeaderTitle>{component.name}</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderAction onClick={handleOpenURL} variant="ghost" label="Delete node">
            <ExternalLink />
          </NodeHeaderAction>
        </NodeHeaderActions>
      </NodeHeader>
      <Toolbar id={id} isEditing={isEditing} setIsEditing={setIsEditing} position={position} />
      {isEditing ? (
        <component.edit data={data} handleUpdateNode={handleUpdateNode} />
      ) : showContent ? (
        <component.data data={data} />
      ) : (
        <Placeholder nodeType={type} />
      )}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </BaseNode>
  );
}
