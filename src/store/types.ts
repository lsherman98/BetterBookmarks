import {
    type Edge,
    type Node,
    type OnNodesChange,
    type OnEdgesChange,
} from '@xyflow/react';

export type AppNode = Node

export type NodeData = {
    title: string;
    url: string;
}

export type AppState = {
    nodes: AppNode[];
    edges: Edge[];
    onNodesChange: OnNodesChange<AppNode>;
    onEdgesChange: OnEdgesChange;
    getNodes: () => AppNode[];
    getEdges: () => Edge[];
    setNodes: (nodes: AppNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    getNode: (id: string) => AppNode | undefined;
    addNode: (node: AppNode) => void;
    addEdge: (edge: Edge) => void;
    deleteNode: (id: string) => void;
    selectNode: (id: string) => void;
    clearSelectedNodes: () => void;
    isNodeSelected: () => boolean;
    targetNode: string | null;
    setTargetNode: (targetNode: string | null) => void;
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
};