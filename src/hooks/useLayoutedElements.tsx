import { useMemo, useRef } from "react";
import useStore from "@/store/store";
import { useShallow } from "zustand/react/shallow";
import { AppState } from "@/store/types";

const selector = (state: AppState) => ({
  setNodes: state.setNodes,
  nodes: state.nodes,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLayoutedElements = (): any => {
  const { setNodes, nodes } = useStore(useShallow(selector));

  // You can use these events if you want the flow to remain interactive while
  // the simulation is running. The simulation is typically responsible for setting
  // the position of nodes, but if we have a reference to the node being dragged,
  // we use that position instead.
  const draggingNodeRef = useRef(null);
  const dragEvents = useMemo(
    () => ({
      start: (_event, node) => {
        draggingNodeRef.current = node;
        setNodes(nodes.map((n) => (n.id === node.id ? { ...n, zIndex: 1 } : { ...n, zIndex: 0 })));
      },
      drag: (_event, node) => {
        draggingNodeRef.current = node;
      },
      stop: () => {
        draggingNodeRef.current = null;
      },
    }),
    [nodes, setNodes]
  );
  return dragEvents;
};
