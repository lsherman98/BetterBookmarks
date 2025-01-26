import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  type FitViewOptions,
  type NodeTypes,
  type DefaultEdgeOptions,
  EdgeTypes,
  addEdge,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import { useShallow } from "zustand/react/shallow";

import { AppState } from "./store/types";
import useStore from "./store/store";
import { useLayoutedElements } from "./lib/forceSimulation";
import { SidebarTrigger } from "./components/ui/sidebar";
import { DefaultNode } from "./components/flow/nodes/default-node";
import { useCallback, useEffect } from "react";
import FloatingConnectionLine from "./components/flow/edges/floatingEdgeConnectionLine";
import FloatingEdge from "./components/flow/edges/floatingEdge";
import { useProximityConnect } from "./hooks/use-proximity-connect";
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
});

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

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
  const { nodes, edges, onNodesChange, onEdgesChange, setEdges } = useStore(useShallow(selector));
  const [initialized, { toggle, isRunning }, dragEvents] = useLayoutedElements();
  const { onNodeDrag, onNodeDragStop } = useProximityConnect(edges, setEdges);

  useEffect(() => {
    if (initialized) toggle();
  }, [toggle, initialized]);

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge(params, edges)),
    [setEdges, edges]
  );

  const handleNodeDrag = (event, node) => {
    dragEvents.drag(event, node);
    onNodeDrag(event, node);
  };

  const handleNodeDragStop = (event, node) => {
    dragEvents.stop(event, node);
    onNodeDragStop(event, node);
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={handleNodeDrag}
        onNodeDragStart={dragEvents.start}
        onNodeDragStop={handleNodeDragStop}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        nodesDraggable={true}
        nodesConnectable={false}
        onConnect={onConnect}
        connectionLineComponent={FloatingConnectionLine}
        defaultViewport={defaultViewport}
      >
        <Panel position="top-left">
          <SidebarTrigger className="-ml-1" />
        </Panel>
        <Panel position="top-right">
          {initialized && (
            <button onClick={toggle}>{isRunning() ? "Stop" : "Start"} force simulation</button>
          )}
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
