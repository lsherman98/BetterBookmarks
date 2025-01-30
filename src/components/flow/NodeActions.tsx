import { Edge, NodeToolbar, Position } from "@xyflow/react";
import { Button } from "../ui/button";
import { PlusIcon, TextCursorInput, Trash } from "lucide-react";
import { AppNode, AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

type NodeToolbarProps = {
  nodeId: string | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  deleteNode: state.deleteNode,
  addNode: state.addNode,
  addEdge: state.addEdge,
});

export default function NodeActions({ nodeId, isEditing, setIsEditing }: NodeToolbarProps) {
  const { nodes, deleteNode, addNode, addEdge } = useStore(useShallow(selector));

  const handleDeleteNode = useCallback(() => {
    if (!nodeId) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
      return;
    }
    deleteNode(nodeId);
  }, [deleteNode, nodeId]);

  const handleAddNode = useCallback(() => {
    if (!nodeId) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
      return;
    }
    const newNode: AppNode = {
      id: (nodes.length + 1).toString(),
      type: "default",
      data: {},
      position: { x: 0, y: 0 },
    };
    const newEdge: Edge = {
      id: `${nodeId}-${newNode.id}`,
      source: nodeId,
      target: newNode.id,
      type: "floating",
    };
    addNode(newNode);
    addEdge(newEdge);
  }, [addEdge, addNode, nodeId, nodes.length]);

  const handleEditNode = useCallback(() => {
    if (!nodeId) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
      return;
    }
    setIsEditing(!isEditing);
  }, [isEditing, nodeId, setIsEditing]);

  return (
    <NodeToolbar position={Position.Bottom} className="space-x-2">
      <Button variant="outline" size="icon" onClick={handleAddNode}>
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" onClick={handleEditNode}>
        <TextCursorInput />
      </Button>
      <Button variant="outline" size="icon" onClick={handleDeleteNode}>
        <Trash />
      </Button>
    </NodeToolbar>
  );
}
