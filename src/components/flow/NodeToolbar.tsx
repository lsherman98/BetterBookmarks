import { Edge, NodeToolbar as RFNodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { Button } from "../ui/button";
import { PlusIcon, Save, TextCursorInput, Trash } from "lucide-react";
import { AppNode, AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";
import { newToast } from "@/lib/utils";

type NodeToolbarProps = {
  id: string | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  position: { x: number; y: number };
};

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  deleteNode: state.deleteNode,
  addNode: state.addNode,
  addEdge: state.addEdge,
});

export default function NodeToolbar({ id, isEditing, setIsEditing, position }: NodeToolbarProps) {
  const { nodes, deleteNode, addNode, addEdge } = useStore(useShallow(selector));
  const { setCenter } = useReactFlow();

  const handleDeleteNode = useCallback(() => {
    if (!id) {
      newToast("destructive", "Something went wrong.");
      return;
    }
    deleteNode(id);
  }, [deleteNode, id]);

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

  const handleEditNode = useCallback(() => {
    if (!id) {
      newToast("destructive", "Something went wrong.");
      return;
    }
    const editState = !isEditing;
    if (editState) {
      setCenter(position.x, position.y, { duration: 500, zoom: 1.2 });
    }
    setIsEditing(!isEditing);
  }, [id, isEditing, setIsEditing, setCenter, position.x, position.y]);

  return (
    <RFNodeToolbar position={Position.Bottom} className="space-x-2">
      <Button variant="outline" size="icon" onClick={handleAddNode}>
        <PlusIcon />
      </Button>
      {isEditing ? (
        <Button size="icon" onClick={handleEditNode}>
          <Save />
        </Button>
      ) : (
        <Button variant="outline" size="icon" onClick={handleEditNode}>
          <TextCursorInput />
        </Button>
      )}
      <Button variant="outline" size="icon" onClick={handleDeleteNode}>
        <Trash />
      </Button>
    </RFNodeToolbar>
  );
}
