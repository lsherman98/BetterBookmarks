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
    if (type === "category" || type === "file") return;
    if ("url" in data) {
      window.open(data.url, "_blank");
    }
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

  return showContent ? (
    <BaseNode
      selected={selected}
      className={`min-w-[12rem] max-w-[16rem] ${type === "category" ? "rounded-full" : ""} ${
        id === targetNode ? "border-2 border-dashed border-blue-500" : ""
      }`}
    >
      <NodeHeader className={`border-b bg-${type}`}>
        <NodeHeaderIcon>{<component.icon />}</NodeHeaderIcon>
        <NodeHeaderTitle>{component.name}</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderAction onClick={handleOpenURL} variant="ghost" label="Delete node">
            {type !== "category" && type !== "file" && <ExternalLink />}
          </NodeHeaderAction>
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
  ) : (
    <BaseNode
      selected={selected}
      className={`min-w-[8rem] shadow-md rounded-md border-2 border-stone-400 bg-${type} ${
        type === "category" && !showContent
          ? "rounded-full w-[12rem] h-[12rem] flex justify-center items-center"
          : ""
      } ${id === targetNode ? "border-4 border-dashed border-blue-300" : ""}`}
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
