import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  type NodeTypes,
  type DefaultEdgeOptions,
  EdgeTypes,
  addEdge,
  Connection,
  Node,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import { useShallow } from "zustand/react/shallow";

import { AppNode, AppState } from "./store/types";
import useStore from "./store/store";
import { useLayoutedElements } from "./hooks/useLayoutedElements";
import { SidebarTrigger } from "./components/ui/sidebar";
import { DefaultNode } from "./components/flow/nodes/default-node";
import { useCallback, useEffect, useRef } from "react";
import FloatingConnectionLine from "./components/flow/edges/floatingEdgeConnectionLine";
import FloatingEdge from "./components/flow/edges/floatingEdge";
import { FlowSidebar } from "./components/flow/FlowSidebar.js";
import { useDnD } from "./hooks/useDnD.js";
import { CrosshairIcon } from "lucide-react";
// import { NodeInspector } from "./components/flow/devtools";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  getNodes: state.getNodes,
  getEdges: state.getEdges,
  selectNode: state.selectNode,
  clearSelectedNodes: state.clearSelectedNodes,
  isNodeSelected: state.isNodeSelected,
  setTargetNode: state.setTargetNode,
  addNodes: state.addNodes,
});

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const defaultEdgeOptions: DefaultEdgeOptions = {};

const proOptions = { hideAttribution: true };

const nodeTypes: NodeTypes = {
  default: DefaultNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setEdges,
    selectNode,
    clearSelectedNodes,
    isNodeSelected,
    setTargetNode,
    addNodes,
  } = useStore(useShallow(selector));
  const [initialized, { toggle, isRunning }, dragEvents] = useLayoutedElements();
  const { getIntersectingNodes, screenToFlowPosition, fitView, viewportInitialized, setCenter } =
    useReactFlow();
  const reactFlowWrapper = useRef(null);
  const [type] = useDnD();

  useEffect(() => {
    if (initialized && viewportInitialized) {
      toggle("on");
      setCenter(0, 0, { zoom: 1 });
    }
  }, [toggle, initialized, viewportInitialized, setCenter]);

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge(params, edges)),
    [setEdges, edges]
  );

  const handleNodeClick = useCallback(
    (_, node) => {
      toggle("off");
      selectNode(node.id);
    },
    [toggle, selectNode]
  );

  const handlePaneClick = useCallback(() => {
    clearSelectedNodes();
    toggle("on");
  }, [toggle, clearSelectedNodes]);

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
      toggle("off");
      dragEvents.start(event, node);
    },
    [toggle, dragEvents]
  );

  const handleNodeDragStop = useCallback(
    (event, node: Node) => {
      setTargetNode(null);
      if (!isNodeSelected()) {
        toggle("on");
      }
      dragEvents.stop(event, node);
    },
    [toggle, dragEvents, isNodeSelected, setTargetNode]
  );

  const handleDragOver = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      toggle("off");
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const intersectingNode = getIntersectingNodes(
        { ...position, width: 150, height: 109 },
        true
      ).at(0);
      setTargetNode(intersectingNode?.id ?? null);
    },
    [getIntersectingNodes, screenToFlowPosition, setTargetNode, toggle]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      toggle("on");
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
      const newNode: AppNode = {
        id: nodes.length.toString(),
        type: type,
        position,
        data: { label: `${type} node` },
      };
      const newEdge = {
        id: `e${intersectingNode.id}-${newNode.id}`,
        source: intersectingNode.id,
        target: newNode.id,
        type: "floating",
      };
      addNodes([newNode]);
      setEdges([...edges, newEdge]);
    },
    [
      toggle,
      setTargetNode,
      screenToFlowPosition,
      getIntersectingNodes,
      nodes.length,
      type,
      addNodes,
      setEdges,
      edges,
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
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onDrop={onDrop}
          panOnDrag={true}
          zoomOnScroll={true}
        >
          <Panel position="top-left">
            <SidebarTrigger className="-ml-1" />
            <CrosshairIcon size={24} onClick={() => fitView({
              padding: 0.2,
              duration: 500
            })}/>
            <br />
            {initialized && <div>force simulation is {isRunning() ? "running" : "stopped"}</div>}
          </Panel>
          <Controls />
          {/* <MiniMap /> */}
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          {/* <NodeToolbar /> */}
          {/* <NodeResizer /> */}
          {/* <NodeInspector /> */}
          {/* <ChangeLogger /> */}
        </ReactFlow>
      </div>
      <FlowSidebar />
    </div>
  );
}

export default App;
