import { NodeToolbar as RFNodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { Button } from "../ui/button";
import { Save, TextCursorInput, Trash } from "lucide-react";
import { AppState } from "@/store/types";
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
  const { edges, deleteNode } = useStore(useShallow(selector));
  const { setCenter } = useReactFlow();

  // Helper function to get descendant ids recursively
  const getDescendantIds = useCallback(
    (parentId: string): string[] => {
      let descendants: string[] = [];
      edges.forEach((edge) => {
        if (edge.source === parentId) {
          descendants.push(edge.target);
          descendants = descendants.concat(getDescendantIds(edge.target));
        }
      });
      return descendants;
    },
    [edges]
  );

  const handleDeleteNode = useCallback(() => {
    if (!id) {
      newToast("destructive", "Something went wrong.");
      return;
    }
    const descendantIds = getDescendantIds(id);
    if (descendantIds.length > 0) {
      const confirmed = window.confirm(
        "This node has child nodes. Do you want to delete it and all its descendants?"
      );
      if (!confirmed) return;
    }
    deleteNode(id);
  }, [id, getDescendantIds, deleteNode]);

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
