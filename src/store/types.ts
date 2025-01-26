import {
    type Edge,
    type Node,
    type OnNodesChange,
    type OnEdgesChange,
} from '@xyflow/react';

export type AppNode = Node;

export type AppState = {
    nodes: AppNode[];
    edges: Edge[];
    onNodesChange: OnNodesChange<AppNode>;
    onEdgesChange: OnEdgesChange;
    setNodes: (nodes: AppNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    getNodes: () => AppNode[];
    getEdges: () => Edge[];
    deleteNode: (id: string) => void;
    addNodes: (node: AppNode[]) => void;
    getNode: (id: string) => AppNode | undefined;
};