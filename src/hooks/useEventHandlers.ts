import useStore from "@/store/store";
import { AppNode, AppState } from "@/store/types";
import { addEdge, Connection, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLayoutedElements } from "./useLayoutedElements";
import { useDnD } from "./useDnD";

const selector = (state: AppState) => ({
    nodes: state.nodes,
    edges: state.edges,
    setEdges: state.setEdges,
    selectNode: state.selectNode,
    clearSelectedNodes: state.clearSelectedNodes,
    isNodeSelected: state.isNodeSelected,
    setTargetNode: state.setTargetNode,
    addNodes: state.addNodes,
});

export const useEventHandlers = () => {
    const {
        nodes,
        edges,
        setEdges,
        selectNode,
        clearSelectedNodes,
        isNodeSelected,
        setTargetNode,
        addNodes,
    } = useStore(useShallow(selector));

    const [initialized, { toggle, }, dragEvents] = useLayoutedElements();
    const { getIntersectingNodes, screenToFlowPosition, viewportInitialized, fitView } =
        useReactFlow();
    const [type] = useDnD();

    useEffect(() => {
        if (initialized && viewportInitialized) {
            toggle("on");
            setTimeout(() => {
                fitView({
                    padding: 0.2,
                    duration: 500,
                });
            }, 2000);
        }
    }, [toggle, initialized, viewportInitialized, fitView]);

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
        (event, node: AppNode) => {
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
        (event, node: AppNode) => {
            toggle("off");
            dragEvents.start(event, node);
        },
        [toggle, dragEvents]
    );

    const handleNodeDragStop = useCallback(
        (event, node: AppNode) => {
            setTargetNode(null);
            if (!isNodeSelected()) {
                toggle("on");
            }
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

            toggle("off");
            toggle("on");
        },
        [setTargetNode, isNodeSelected, dragEvents, getIntersectingNodes, toggle, edges, setEdges]
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


    return { onConnect, handleNodeClick, handlePaneClick, handleNodeDrag, handleNodeDragStart, handleNodeDragStop, handleDragOver, onDrop };
}
    ;