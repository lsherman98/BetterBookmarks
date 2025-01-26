/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Edge, useReactFlow, useStoreApi } from "@xyflow/react";
import { useCallback } from "react";

const MIN_DISTANCE = 150;
export function useProximityConnect(edges: Edge[], setEdges: (edges: Edge[]) => void) {
    const store = useStoreApi();
    const { getInternalNode } = useReactFlow();
    const getClosestEdge = useCallback(
        (node) => {
            const { nodeLookup } = store.getState();
            const internalNode = getInternalNode(node.id);
            const closestNode = Array.from(nodeLookup.values()).reduce(
                (res, n) => {
                    if (internalNode && n.id !== internalNode.id) {
                        const dx = n.internals.positionAbsolute.x - internalNode.internals.positionAbsolute.x;
                        const dy = n.internals.positionAbsolute.y - internalNode.internals.positionAbsolute.y;
                        const d = Math.sqrt(dx * dx + dy * dy);

                        if (d < res.distance && d < MIN_DISTANCE) {
                            res.distance = d;
                            res.node = n;
                        }
                    }

                    return res;
                },
                {
                    distance: Number.MAX_VALUE,
                    node: null,
                }
            );

            if (!closestNode.node) {
                return null;
            }

            const closeNodeIsSource =
                closestNode.node.internals.positionAbsolute.x < internalNode!.internals.positionAbsolute.x;

            return {
                id: closeNodeIsSource
                    ?
                    `${closestNode.node.id}-${node.id}`
                    :
                    `${node.id}-${closestNode.node.id}`,
                source: closeNodeIsSource ? closestNode.node.id : node.id,
                target: closeNodeIsSource ? node.id : closestNode.node.id,
                className: "",
            };
        },
        [store, getInternalNode]
    );

    const onNodeDrag = useCallback(
        (_, node) => {
            const closeEdge = getClosestEdge(node);
            const nextEdges = edges.filter((e) => e.className !== "temp");
            if (
                closeEdge &&
                !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
            ) {
                closeEdge.className = "temp";
                nextEdges.push(closeEdge);
            }
            setEdges(nextEdges);
        },
        [getClosestEdge, setEdges, edges]
    );

    const onNodeDragStop = useCallback(
        (_, node) => {
            const closeEdge = getClosestEdge(node);
            const nextEdges = edges.filter((e) => e.className !== "temp");

            if (
                closeEdge &&
                !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
            ) {
                nextEdges.push({ ...closeEdge, type: "floating" });
            }
            setEdges(nextEdges);
        },
        [getClosestEdge, edges, setEdges]
    );

    return { onNodeDrag, onNodeDragStop };
}