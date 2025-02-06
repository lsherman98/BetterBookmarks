import { CustomNodeWrapper } from "@/components/flow/nodes/CustomNodeWrapper";
import DefaultNodeDataDisplay from "@/components/flow/nodes/BasicNode/BasicNodeDataDisplay";
import DefaultNodeEditForm from "@/components/flow/nodes/BasicNode/BasicNodeEditForm";
import { RootNode } from "@/components/flow/nodes/RootNode/RootNode";
import YoutubeNodeEditForm from "@/components/flow/nodes/YoutubeNode/YoutubeNodeEditForm";
import { EdgeTypes, NodeTypes } from "@xyflow/react";
import { BookOpenText, Link2, LucideIcon, Network, Newspaper, Podcast, Rss, Youtube } from "lucide-react";
import CategoryNodeDataDisplay from "@/components/flow/nodes/CategoryNode/CategoryNodeDataDisplay";
import CategoryNodeEditForm from "@/components/flow/nodes/CategoryNode/CategoryNodeEditForm";
import BasicNodeEditForm from "@/components/flow/nodes/BasicNode/BasicNodeEditForm";
import BasicNodeDataDisplay from "@/components/flow/nodes/BasicNode/BasicNodeDataDisplay";
import YoutubeNodeDataDisplay from "@/components/flow/nodes/YoutubeNode/YoutubeNodeDataDisplay";
import BlogNodeEditForm from "@/components/flow/nodes/BlogNode/BlogNodeEditForm";
import BlogNodeDataDisplay from "@/components/flow/nodes/BlogNode/BlogNodeDataDisplay";
import FloatingEdge from "@/components/flow/edges/FloatingEdge";

export const nodeTypes: NodeTypes = {
    root: RootNode,
    category: CustomNodeWrapper,
    basic: CustomNodeWrapper,
    youtube: CustomNodeWrapper,
    blog: CustomNodeWrapper,
    article: CustomNodeWrapper,
    podcast: CustomNodeWrapper,
    book: CustomNodeWrapper,
};

export const edgeTypes: EdgeTypes = {
    floating: FloatingEdge,
};

type ReactComponent = (props) => JSX.Element;
type CustomNodeType = { edit: ReactComponent, data: ReactComponent, icon: LucideIcon, order: number, name: string };
export const customNodes: { [key: string]: CustomNodeType } = {
    "category": {
        name: "Category",
        order: 0,
        edit: CategoryNodeEditForm,
        data: CategoryNodeDataDisplay,
        icon: Network,
    },
    "basic": {
        name: "Basic",
        order: 1,
        edit: BasicNodeEditForm,
        data: BasicNodeDataDisplay,
        icon: Link2,
    },
    "youtube": {
        name: "YouTube",
        order: 2,
        edit: YoutubeNodeEditForm,
        data: YoutubeNodeDataDisplay,
        icon: Youtube,
    },
    "blog": {
        name: "Blog",
        order: 3,
        edit: BlogNodeEditForm,
        data: BlogNodeDataDisplay,
        icon: Rss,
    },
    "article": {
        name: "Article",
        order: 4,
        edit: DefaultNodeEditForm,
        data: DefaultNodeDataDisplay,
        icon: Newspaper,
    },
    "podcast": {
        name: "Podcast",
        order: 5,
        edit: DefaultNodeEditForm,
        data: DefaultNodeDataDisplay,
        icon: Podcast,
    },
    "book": {
        name: "Book",
        order: 6,
        edit: DefaultNodeEditForm,
        data: DefaultNodeDataDisplay,
        icon: BookOpenText,
    },
}
