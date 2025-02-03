import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

import { initialNodes } from './nodes';
import { initialEdges } from './edges';
import { type AppState } from './types';
import { flows } from './flows';
import { layoutGraph } from '@/lib/layoutGraph';

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    targetNode: null,
    isRunning: false,
    flows: flows,
    selectedFlow: flows[0],
    addFlow: (flowData) => {
        set({
            flows: [...get().flows, { id: String(get().flows.length + 1), data: flowData }],
        });
    },
    updateFlow: (flowId, data) => {
        set({
            flows: get().flows.map((flow) => (flow.id === flowId ? { ...flow, data } : flow)),
        });
    },
    setSelectedFlow: (flowId) => {
        set({
            selectedFlow: get().flows.find((flow) => flow.id === flowId),
        });
    },
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
    getNodes: () => get().nodes,
    getEdges: () => get().edges,
    setNodes: (nodes) => {
        set({ nodes });
    },
    setEdges: (edges) => {
        set({ edges });
    },
    getNode: (id) => get().nodes.find((node) => node.id === id),
    addNode(node) {
        set({
            nodes: [...get().nodes, node],
        });
        get().layoutNodes();
    },
    addEdge: (edge) => {
        set({
            edges: [...get().edges, edge],
        });
    },
    updateNode: (id, data) => {
        set({
            nodes: get().nodes.map((node) => (node.id === id ? { ...node, data } : node)),
        });
        get().layoutNodes();
    },
    deleteNode: (id) => {
        const { nodes, edges } = get();
        const getDescendantIds = (parentId: string): string[] => {
            let descendants: string[] = [];
            edges.forEach(edge => {
                if (edge.source === parentId) {
                    descendants.push(edge.target);
                    descendants = descendants.concat(getDescendantIds(edge.target));
                }
            });
            return descendants;
        };
        const descendantIds = getDescendantIds(id);
        const nodesToDelete = [id, ...descendantIds];
        console.log(nodes.filter(node => !nodesToDelete.includes(node.id)));
        set({
            nodes: nodes.filter(node => !nodesToDelete.includes(node.id)),
            edges: edges.filter(edge => !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)),
        });
        get().layoutNodes();
    },
    selectNode: (id) => {
        set({
            nodes: get().nodes.map((node) => ({
                ...node,
                selected: node.id === id ? true : false,
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
    setTargetNode: (targetNode) => {
        set({ targetNode });
    },
    setIsRunning: (isRunning) => {
        set({ isRunning });
    },
    layoutNodes: () => {
        const { nodes, edges } = layoutGraph(get().nodes, get().edges);
        set({
            nodes,
            edges,
        });
    },
}));

export default useStore;