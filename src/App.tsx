import {
  Background,
  BackgroundVariant,
  Panel,
  ReactFlow,
  type DefaultEdgeOptions,
  useReactFlow,
  addEdge,
  Connection,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import { useShallow } from "zustand/react/shallow";

import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useLayoutedElements } from "@/hooks/useLayoutedElements.js";
import { useCallback, useEffect, useRef } from "react";
import { FlowToolbar } from "@/components/flow/FlowToolbar.js";
import { useDnD } from "@/hooks/useDnD.jsx";
import FloatingConnectionLine from "@/components/flow/edges/FloatingEdgeConnectionLine.jsx";
import { edgeTypes, nodeTypes } from "./lib/data";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setEdges: state.setEdges,
  setNodes: state.setNodes,
  selectNode: state.selectNode,
  clearSelectedNodes: state.clearSelectedNodes,
  isNodeSelected: state.isNodeSelected,
  setTargetNode: state.setTargetNode,
  isRunning: state.isRunning,
});

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const defaultEdgeOptions: DefaultEdgeOptions = {};

const proOptions = { hideAttribution: true };

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
  const [initialized, { toggle }, dragEvents] = useLayoutedElements();
  const { getIntersectingNodes, screenToFlowPosition, fitView, viewportInitialized} =
    useReactFlow();
  const reactFlowWrapper = useRef(null);
  const [type] = useDnD();

  useEffect(() => {
    if (initialized && viewportInitialized) {
      toggle("on");
      setTimeout(() => {
        toggle("off");
        fitView({
          padding: 0.2,
          duration: 500,
        });
      }, 100);
    }
  }, [toggle, initialized, viewportInitialized, fitView]);

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge(params, edges)),
    [edges, setEdges]
  );

  const handleNodeClick = useCallback(
    (_, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    clearSelectedNodes();
  }, [clearSelectedNodes]);

  const handleNodeDrag = useCallback(
    (event, node: Node) => {
      dragEvents.drag(event, node);
      const intersection = getIntersectingNodes(node)
        .map((n) => n.id)
        .at(0);
      if (!intersection) setTargetNode(null);
      else setTargetNode(intersection);
    },
    [dragEvents, getIntersectingNodes, setTargetNode]
  );

  const handleNodeDragStart = useCallback(
    (event, node: Node) => {
      dragEvents.start(event, node);
    },
    [dragEvents]
  );

  const handleNodeDragStop = useCallback(
    (event, node: Node) => {
      setTargetNode(null);
      dragEvents.stop(event, node);
      const intersectingNode = getIntersectingNodes(node)
        .map((n) => n.id)
        .at(0);

      if (intersectingNode && intersectingNode !== node.id) {
        const newEdges = edges.map((edge) =>
          edge.target === node.id ? { ...edge, source: intersectingNode } : edge
        );
        setEdges(newEdges);
      }
    },
    [setTargetNode, dragEvents, getIntersectingNodes, edges, setEdges]
  );

  const handleDragOver = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const intersectingNode = getIntersectingNodes(
        { ...position, width: 192, height: 135 },
        true
      ).at(0);
      setTargetNode(intersectingNode?.id ?? null);
    },
    [getIntersectingNodes, screenToFlowPosition, setTargetNode]
  );

  const onDrop = useCallback(
    (event) => {
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
        { ...position, width: 150, height: 109 },
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
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDrag={handleNodeDrag}
          onNodeDragStart={handleNodeDragStart}
          onNodeDragStop={handleNodeDragStop}
          onDragOver={handleDragOver}
          defaultEdgeOptions={defaultEdgeOptions}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          nodesDraggable={true}
          nodesConnectable={false}
          onConnect={onConnect}
          connectionLineComponent={FloatingConnectionLine}
          defaultViewport={defaultViewport}
          selectNodesOnDrag={false}
          elevateEdgesOnSelect={true}
          elevateNodesOnSelect={true}
          selectionOnDrag={false}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onDrop={onDrop}
          panOnDrag={true}
          zoomOnScroll={true}
          maxZoom={1.3}
          deleteKeyCode={null}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          disableKeyboardA11y={true}
        >
          {/* <DevTools /> */}
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
