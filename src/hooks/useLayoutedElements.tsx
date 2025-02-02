/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from "d3-force";
import { collide } from "../lib/collide";
import { useNodesInitialized, useReactFlow } from "@xyflow/react";
import { useMemo, useRef } from "react";
import useStore from "@/store/store";
import { useShallow } from "zustand/react/shallow";

const simulation = forceSimulation()
  .force("charge", forceManyBody().strength(-2000))
  .force("x", forceX().x(0).strength(0.02))
  .force("y", forceY().y(0).strength(0.02))
  .force("collide", collide())
  .alphaTarget(0.005)
  .stop();

const selector = (state: AppState) => ({
  setIsRunning: state.setIsRunning,
});

export const useLayoutedElements = (): any => {
  const { setIsRunning } = useStore(useShallow(selector));
  const { getNodes, setNodes, getEdges } = useReactFlow();
  const initialized = useNodesInitialized();

  // You can use these events if you want the flow to remain interactive while
  // the simulation is running. The simulation is typically responsible for setting
  // the position of nodes, but if we have a reference to the node being dragged,
  // we use that position instead.
  const draggingNodeRef = useRef(null);
  const dragEvents = useMemo(
    () => ({
      start: (_event, node) => {
        draggingNodeRef.current = node;
        setNodes((nodes) =>
          nodes.map((n) => (n.id === node.id ? { ...n, zIndex: 1 } : { ...n, zIndex: 0 }))
        );
      },
      drag: (_event, node) => {
        draggingNodeRef.current = node;
      },
      stop: () => {
        draggingNodeRef.current = null;
      },
    }),
    [setNodes]
  );

  return useMemo(() => {
    const nodes = getNodes().map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }));
    const edges = getEdges().map((edge) => edge);
    let running = false;

    // If React Flow hasn't initialized our nodes with a width and height yet, or
    // if there are no nodes in the flow, then we can't run the simulation!
    if (!initialized || nodes.length === 0) return [false, {}, dragEvents];

    simulation.nodes(nodes).force(
      "link",
      forceLink(edges)
        .id((d) => d.id)
        .strength(0.5)
        .distance(500)
    );

    // The tick function is called every animation frame while the simulation is
    // running and progresses the simulation one step forward each time.
    const tick = () => {
      getNodes().forEach((node, i) => {
        const dragging = draggingNodeRef.current?.id === node.id;

        // Setting the fx/fy properties of a node tells the simulation to "fix"
        // the node at that position and ignore any forces that would normally
        // cause it to move.
        if (dragging) {
          if (nodes[i]?.fx) nodes[i].fx = draggingNodeRef.current.position.x;
          if (nodes[i]?.fy) nodes[i].fy = draggingNodeRef.current.position.y;
        } else {
          if (nodes[i]?.fx) delete nodes[i].fx;
          if (nodes[i]?.fy) delete nodes[i].fy;
        }
      });

      simulation.tick();
      setNodes(() =>
        nodes.map((node) => ({
          ...node,
          position: {
            x: node.fx ?? node.x,
            y: node.fy ?? node.y,
          },
        }))
      );

      window.requestAnimationFrame(() => {
        // Give React and React Flow a chance to update and render the new node
        // positions before we fit the viewport to the new layout.
        // fitView({
        //     padding: 0.2,
        //     duration: 500
        // });
        // If the simulation hasn't been stopped, schedule another tick.
        if (running) tick();
      });
    };

    const toggle = (cmd?: "on" | "off") => {
      if (cmd == "on") {
        running = true;
      }
      if (cmd == "off") {
        running = false;
      }
      if (!running) {
        getNodes().forEach((node, index) => {
          const simNode = nodes[index];
          Object.assign(simNode, node);
          simNode.x = node.position.x;
          simNode.y = node.position.y;
          simNode.selected = false;
        });
      }
      if (cmd !== "on" && cmd !== "off") {
        running = !running;
      }
      setIsRunning(running);
      running && window.requestAnimationFrame(tick);
    };

    const isRunning = () => running;
    return [true, { toggle, isRunning }, dragEvents];
  }, [getNodes, getEdges, initialized, dragEvents, setIsRunning, setNodes]);
};
