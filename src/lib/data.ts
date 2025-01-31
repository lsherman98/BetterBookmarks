import FloatingEdge from "@/components/flow/edges/FloatingEdge";
import { DefaultNode } from "@/components/flow/nodes/CustomNodeWrapper";
import DefaultNodeDataDisplay from "@/components/flow/nodes/DefaultNode/DefaultNodeData";
import DefaultNodeEditForm from "@/components/flow/nodes/DefaultNode/DefaultNodeEditForm";
import { RootNode } from "@/components/flow/nodes/RootNode/RootNode";
import { EdgeTypes, NodeTypes } from "@xyflow/react";
import { Link, LucideIcon } from "lucide-react";

export const nodeTypes: NodeTypes = {
    default: DefaultNode,
    root: RootNode,
};

export const edgeTypes: EdgeTypes = {
    floating: FloatingEdge,
};

type ReactComponent = (props) => JSX.Element;
export const customNodes: { [key: string]: { edit: ReactComponent, data: ReactComponent, icon: LucideIcon } } = {
    "default": {
        edit: DefaultNodeEditForm,
        data: DefaultNodeDataDisplay,
        icon: Link,
    }
}
