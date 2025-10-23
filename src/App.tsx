import { useCallback, useEffect, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  useReactFlow,
  addEdge,
  Connection,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useShallow } from "zustand/react/shallow";

import "./App.css";
import { FlowToolbar } from "@/components/flow/FlowToolbar";
import FloatingConnectionLine from "@/components/flow/edges/floatingEdgeConnectionLine";
import { useDnD } from "@/hooks/useDnD";
import { useLayoutedElements } from "@/hooks/useLayoutedElements";
import { edgeTypes, nodeTypes } from "@/lib/data";
import useStore, { loadFromLocalStorage } from "@/store/store";
import { AppState } from "@/store/types";

const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1.5 };
const PRO_OPTIONS = { hideAttribution: true };
const FIT_VIEW_CONFIG = {
  padding: 0.2,
  duration: 500,
  maxZoom: 1,
};
const NODE_DIMENSIONS = { width: 192, height: 135 };
const DROP_NODE_DIMENSIONS = { width: 150, height: 109 };

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setEdges: state.setEdges,
  setNodes: state.setNodes,
  selectNode: state.selectNode,
  clearSelectedNodes: state.clearSelectedNodes,
  setTargetNode: state.setTargetNode,
});

function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setEdges,
    setNodes,
    selectNode,
    clearSelectedNodes,
    setTargetNode,
  } = useStore(useShallow(selector));

  const dragEvents = useLayoutedElements();
  const { getIntersectingNodes, screenToFlowPosition, fitView, viewportInitialized } =
    useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [type] = useDnD();

  useEffect(() => {
    const { nodes: savedNodes, edges: savedEdges } = loadFromLocalStorage();
    setNodes(savedNodes);
    setEdges(savedEdges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (viewportInitialized) {
      setTimeout(() => {
        fitView(FIT_VIEW_CONFIG);
      }, 200);
    }
  }, [viewportInitialized, fitView]);

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge(params, edges)),
    [edges, setEdges]
  );

  const handleNodeClick = useCallback(
    (_: unknown, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    clearSelectedNodes();
  }, [clearSelectedNodes]);

  const handleNodeDrag = useCallback(
    (_: unknown, node: Node) => {
      dragEvents.drag(_, node);

      const intersectingNodeId = getIntersectingNodes(node)
        .map((n) => n.id)
        .at(0);

      setTargetNode(intersectingNodeId ?? null);
    },
    [dragEvents, getIntersectingNodes, setTargetNode]
  );

  const handleNodeDragStart = useCallback(
    (_: unknown, node: Node) => {
      dragEvents.start(_, node);
    },
    [dragEvents]
  );

  const handleNodeDragStop = useCallback(
    (_: unknown, node: Node) => {
      setTargetNode(null);
      dragEvents.stop(_, node);

      const intersectingNodeId = getIntersectingNodes(node)
        .map((n) => n.id)
        .at(0);

      if (intersectingNodeId && intersectingNodeId !== node.id) {
        const newEdges = edges.map((edge) =>
          edge.target === node.id ? { ...edge, source: intersectingNodeId } : edge
        );
        setEdges(newEdges);
      }
    },
    [setTargetNode, dragEvents, getIntersectingNodes, edges, setEdges]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const intersectingNode = getIntersectingNodes({ ...position, ...NODE_DIMENSIONS }, true).at(
        0
      );

      setTargetNode(intersectingNode?.id ?? null);
    },
    [getIntersectingNodes, screenToFlowPosition, setTargetNode]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (event.dataTransfer.files.length > 0) {
        return;
      }

      setTargetNode(null);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const intersectingNode = getIntersectingNodes(
        { ...position, ...DROP_NODE_DIMENSIONS },
        true
      ).at(0);

      if (!intersectingNode) {
        return;
      }

      const newNode = {
        id: (nodes.length + 1).toString(),
        type: type,
        position,
        data: { isNew: true },
      };

      const newEdge = {
        id: `e${intersectingNode.id}-${newNode.id}`,
        source: intersectingNode.id,
        target: newNode.id,
        type: "floating",
      };

      setNodes([...nodes, newNode]);
      setEdges([...edges, newEdge]);
      selectNode(newNode.id);
    },
    [
      setTargetNode,
      screenToFlowPosition,
      getIntersectingNodes,
      nodes,
      type,
      setNodes,
      setEdges,
      edges,
      selectNode,
    ]
  );

  return (
    <div className="flex flex-row flex-grow h-full" ref={reactFlowWrapper}>
      <div className="flex-grow h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDrag={handleNodeDrag}
          onNodeDragStart={handleNodeDragStart}
          onNodeDragStop={handleNodeDragStop}
          onDragOver={handleDragOver}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          proOptions={PRO_OPTIONS}
          nodesDraggable={true}
          nodesConnectable={false}
          onConnect={onConnect}
          connectionLineComponent={FloatingConnectionLine}
          defaultViewport={DEFAULT_VIEWPORT}
          selectNodesOnDrag={false}
          elevateEdgesOnSelect={true}
          elevateNodesOnSelect={true}
          selectionOnDrag={false}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onDrop={onDrop}
          panOnDrag={true}
          zoomOnScroll={true}
          deleteKeyCode={null}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          disableKeyboardA11y={true}
          minZoom={0.1}
          className="!bg-teal-50"
        >
          <Panel position="top-center">
            <FlowToolbar />
          </Panel>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
