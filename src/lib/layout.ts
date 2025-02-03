import { forceSimulation, forceManyBody, forceX, forceY } from "d3-force";
import { AppNode } from "@/store/types";
import { Edge } from "@xyflow/react";
import { collide } from "./collide";

interface SimulationNode extends AppNode {
    x: number;
    y: number;
    fx?: number;
    fy?: number;
}

export const layoutGraph = (
    inputNodes: AppNode[],
    inputEdges: Edge[],
    options = {
        iterations: 2000,
        manyBodyStrength: -2000,
        xStrength: 0.03,
        yStrength: 0.03,
        linkStrength: 0.05,
        linkDistance: 500,
    }
) => {
    const nodes: SimulationNode[] = inputNodes.map((node) => ({
        ...node,
        x: node.position.x,
        y: node.position.y,
    }));

    const simulation = forceSimulation()
        .force("charge", forceManyBody().strength(options.manyBodyStrength))
        .force("x", forceX().x(0).strength(options.xStrength))
        .force("y", forceY().y(0).strength(options.yStrength))
        .force("collide", collide())
        .alphaTarget(0.05)
        .nodes(nodes);

    // Run the simulation synchronously
    for (let i = 0; i < options.iterations; i++) {
        simulation.tick();
    }

    simulation.stop();

    // Convert the nodes back to the expected format
    const positionedNodes = nodes.map((node) => ({
        ...node,
        position: {
            x: node.x,
            y: node.y,
        },
    }));

    return {
        nodes: positionedNodes,
        edges: inputEdges,
    };
};