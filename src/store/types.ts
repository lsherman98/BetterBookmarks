import {
    type Edge,
    type Node,
    type OnNodesChange,
    type OnEdgesChange,
} from '@xyflow/react';

export type AppNode = Node;

export type BasicNodeData = {
    isNew?: boolean;
    title: string;
    url: string;
    description?: string;
    tags: string[];
};

export type CategoryNodeData = {
    isNew?: boolean;
    title: string;
    description?: string;
    tags: string[];
};

export type BookNodeData = BasicNodeData & {
    author: string;
};

export type FileNodeData = {
    isNew?: boolean;
    title: string;
    file: File | undefined;
    description?: string;
    tags: string[];
};

export type ArticleNodeData = BasicNodeData;
export type BlogNodeData = BasicNodeData;
export type PodcastNodeData = BasicNodeData;
export type YoutubeNodeData = BasicNodeData;

export type NodeData =
    | BasicNodeData
    | BookNodeData
    | CategoryNodeData
    | FileNodeData
    | ArticleNodeData
    | BlogNodeData
    | PodcastNodeData
    | YoutubeNodeData;

export type YoutubeNodeEditFormProps = {
    handleUpdateNode: (data: YoutubeNodeData) => void;
    data: YoutubeNodeData;
};

export type PodcastNodeEditFormProps = {
    handleUpdateNode: (data: PodcastNodeData) => void;
    data: PodcastNodeData;
};

export type BlogNodeEditFormProps = {
    handleUpdateNode: (data: BlogNodeData) => void;
    data: BlogNodeData;
};

export type ArticleNodeEditFormProps = {
    handleUpdateNode: (data: ArticleNodeData) => void;
    data: ArticleNodeData;
};

export type BookNodeEditFormProps = {
    handleUpdateNode: (data: BookNodeData) => void;
    data: BookNodeData;
};

export type CategoryNodeEditFormProps = {
    handleUpdateNode: (data: CategoryNodeData) => void;
    data: CategoryNodeData;
};

export type BasicNodeEditFormProps = {
    handleUpdateNode: (data: BasicNodeData) => void;
    data: BasicNodeData;
};

export type FileNodeEditFormProps = {
    handleUpdateNode: (data: FileNodeData) => void;
    data: FileNodeData;
};

export type AppState = {
    nodes: AppNode[];
    edges: Edge[];
    targetNode: string | null;
    isRunning: boolean;
    onNodesChange: OnNodesChange<AppNode>;
    onEdgesChange: OnEdgesChange;
    getNodes: () => AppNode[];
    getEdges: () => Edge[];
    getNode: (id: string) => AppNode | undefined;
    setNodes: (nodes: AppNode[]) => void;
    setEdges: (edges: Edge[]) => void;
    setTargetNode: (targetNode: string | null) => void;
    setIsRunning: (isRunning: boolean) => void;
    addNode: (node: AppNode) => void;
    updateNode: (id: string, data: NodeData) => void;
    deleteNode: (id: string) => void;
    addEdge: (edge: Edge) => void;
    selectNode: (id: string) => void;
    clearSelectedNodes: () => void;
    isNodeSelected: () => boolean;
    layoutNodes: () => void;
};