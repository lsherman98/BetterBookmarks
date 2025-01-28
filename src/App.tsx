import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  type NodeTypes,
  type DefaultEdgeOptions,
  EdgeTypes,
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
import { useRef } from "react";
import FloatingConnectionLine from "./components/flow/edges/floatingEdgeConnectionLine";
import FloatingEdge from "./components/flow/edges/floatingEdge";
import { FlowSidebar } from "./components/flow/FlowSidebar.js";
import { CrosshairIcon } from "lucide-react";
import { useEventHandlers } from "./hooks/useEventHandlers.js";
// import { NodeInspector } from "./components/flow/devtools";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
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
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(useShallow(selector));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialized, { toggle, isRunning }, dragEvents] = useLayoutedElements();
  const { fitView } = useReactFlow();
  const reactFlowWrapper = useRef(null);

  const {
    onConnect,
    handleNodeClick,
    handlePaneClick,
    handleNodeDrag,
    handleNodeDragStart,
    handleNodeDragStop,
    handleDragOver,
    onDrop,
  } = useEventHandlers();

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
        >
          <Panel position="top-left">
            <SidebarTrigger className="-ml-1" />
            <CrosshairIcon
              size={24}
              onClick={() =>
                fitView({
                  padding: 0.2,
                  duration: 500,
                })
              }
            />
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
