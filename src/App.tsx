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

import { AppState } from "./store/types";
import useStore from "./store/store";
import { useLayoutedElements } from "./hooks/useLayoutedElements";
import { SidebarTrigger } from "./components/ui/sidebar";
import { DefaultNode } from "./components/flow/nodes/default-node";
import { useCallback, useEffect } from "react";
import FloatingConnectionLine from "./components/flow/edges/floatingEdgeConnectionLine";
import FloatingEdge from "./components/flow/edges/floatingEdge";
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
  } = useStore(useShallow(selector));
  const [initialized, { toggle, isRunning }, dragEvents] = useLayoutedElements();
  const { getIntersectingNodes } = useReactFlow();

  useEffect(() => {
    if (initialized) {
      toggle("on");
    }
  }, [toggle, initialized]);

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
    toggle("on");
    clearSelectedNodes();
  }, [toggle, clearSelectedNodes]);

  const handleNodeDrag = useCallback(
    (event, node: Node) => {
      dragEvents.drag(event, node);
      const intersection = getIntersectingNodes(node).map((n) => n.id).at(0);
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
      if (!isNodeSelected()) {
        toggle("on");
      }
      dragEvents.stop(event, node);
    },
    [toggle, dragEvents, isNodeSelected]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={handleNodeDrag}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
        defaultEdgeOptions={defaultEdgeOptions}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        nodesDraggable={true}
        nodesConnectable={false}
        onConnect={onConnect}
        connectionLineComponent={FloatingConnectionLine}
        defaultViewport={defaultViewport}
        selectNodesOnDrag={true}
        elevateEdgesOnSelect={true}
        elevateNodesOnSelect={true}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
      >
        <Panel position="top-left">
          <SidebarTrigger className="-ml-1" />
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
  );
}

export default App;
