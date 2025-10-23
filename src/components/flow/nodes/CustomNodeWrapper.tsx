import { useEffect, useState } from "react";
import { NodeProps, Node, useNodeId, Position, Handle, useStore as flowStore } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { ExternalLink } from "lucide-react";
import { BaseNode } from "@/components/flow/BaseNode";
import {
  NodeHeader,
  NodeHeaderAction,
  NodeHeaderActions,
  NodeHeaderIcon,
  NodeHeaderTitle,
} from "@/components/flow/NodeHeader";
import Toolbar from "@/components/flow/NodeToolbar";
import { customNodes } from "@/lib/data";
import { newToast } from "@/lib/utils";
import useStore from "@/store/store";
import { AppState, NodeData } from "@/store/types";

const ZOOM_THRESHOLD = 0.9;
const NODE_POSITION_OFFSET = 200;

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
  const position = {
    x: positionAbsoluteX + NODE_POSITION_OFFSET,
    y: positionAbsoluteY + NODE_POSITION_OFFSET,
  };

  const { targetNode, updateNode, selectNode } = useStore(useShallow(selector));
  const showContent = flowStore((s) => s.transform[2] >= ZOOM_THRESHOLD);
  const [isEditing, setIsEditing] = useState(false);
  const component = customNodes[type];

  const handleOpenURL = () => {
    if (type === "category" || type === "file") return;

    if ("url" in data) {
      const url = `https://${data.url}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleUpdateNode = (updatedData: NodeData) => {
    if (!id) {
      newToast("destructive", "Something went wrong.");
      return;
    }
    updateNode(id, updatedData);
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
      handleUpdateNode({ ...data, isNew: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTargeted = id === targetNode;
  const targetedClassName = isTargeted ? "border-2 border-dashed border-blue-500" : "";

  if (showContent) {
    return (
      <BaseNode selected={selected} className={`min-w-[12rem] max-w-[16rem] ${targetedClassName}`}>
        <NodeHeader className={`border-b bg-${type}`}>
          <NodeHeaderIcon>
            <component.icon />
          </NodeHeaderIcon>
          <NodeHeaderTitle>{component.name}</NodeHeaderTitle>
          <NodeHeaderActions>
            {type !== "category" && type !== "file" && (
              <NodeHeaderAction onClick={handleOpenURL} variant="ghost" label="Open URL">
                <ExternalLink />
              </NodeHeaderAction>
            )}
          </NodeHeaderActions>
        </NodeHeader>
        <Toolbar id={id} isEditing={isEditing} setIsEditing={setIsEditing} position={position} />
        {isEditing ? (
          <component.edit data={data} handleUpdateNode={handleUpdateNode} />
        ) : (
          <component.data data={data} />
        )}
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </BaseNode>
    );
  }

  const categoryClassName =
    type === "category" ? "rounded-full w-[12rem] h-[12rem] flex justify-center items-center" : "";

  return (
    <BaseNode
      selected={selected}
      className={`min-w-[8rem] shadow-md rounded-md border-2 border-stone-400 bg-${type} ${categoryClassName} ${targetedClassName}`}
    >
      <div className="flex items-center justify-center p-2 gap-2 text-lg">
        <component.icon />
        {component.name}
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </BaseNode>
  );
}
