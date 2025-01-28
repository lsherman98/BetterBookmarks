import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges} from '@xyflow/react';

import { initialNodes } from './nodes';
import { initialEdges } from './edges';
import { type AppState } from './types';

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    setNodes: (nodes) => {
        set({ nodes });
    },
    setEdges: (edges) => {
        set({ edges });
    },
    getNodes: () => get().nodes,
    getEdges: () => get().edges,
    deleteNode: (id) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== id),
            edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
        });
    },
    addNodes: (nodes) => {
        set({
            nodes: [...get().nodes, ...nodes],
        });
    },
    getNode: (id) => get().nodes.find((node) => node.id === id),
    selectNode: (id) => {
        set({
            nodes: get().nodes.map((node) => ({
                ...node,
                selected: node.id === id,
            })),
        });
    },
    clearSelectedNodes: () => {
        set({
            nodes: get().nodes.map((node) => ({
                ...node,
                selected: false,
            })),
        });
    },
    isNodeSelected: () => get().nodes.some((node) => node.selected),
    targetNode: null,
    setTargetNode: (targetNode) => {
        set({ targetNode });
    },
    isRunning: false,
    setIsRunning: (isRunning) => {
        set({ isRunning });
    },
}));

export default useStore;