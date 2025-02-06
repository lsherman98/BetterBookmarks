import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { initialNodes } from './nodes';
import { initialEdges } from './edges';
import { type AppState } from './types';
import { layoutGraph } from '@/lib/layout';

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    targetNode: null,
    isRunning: false,
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

const saveToLocalStorage = (state: AppState) => {
    localStorage.setItem('nodes', JSON.stringify(state.nodes));
    localStorage.setItem('edges', JSON.stringify(state.edges));
};

useStore.subscribe((state) => {
    saveToLocalStorage(state);
});

export const loadFromLocalStorage = () => {
    let nodes = [];
    let edges = [];
    try {
        nodes = JSON.parse(localStorage.getItem('nodes') || '[]');
    } catch (e) {
        console.error('Error parsing nodes from localStorage', e);
    }
    try {
        edges = JSON.parse(localStorage.getItem('edges') || '[]');
    } catch (e) {
        console.error('Error parsing edges from localStorage', e);
    }
    return { nodes, edges };
}

export default useStore;