import { EdgeTypes, NodeTypes } from "@xyflow/react";
import {
    BookOpenText,
    Link2,
    LucideIcon,
    Network,
    Newspaper,
    Podcast,
    Rss,
    Youtube,
} from "lucide-react";

import FloatingEdge from "@/components/flow/edges/floatingEdge";
import { CustomNodeWrapper } from "@/components/flow/nodes/CustomNodeWrapper";
import { RootNode } from "@/components/flow/nodes/RootNode/RootNode";
import ArticleNodeDataDisplay from "@/components/flow/nodes/ArticleNode/ArticleNodeDataDisplay";
import ArticleNodeEditForm from "@/components/flow/nodes/ArticleNode/ArticleNodeEditForm";
import BasicNodeDataDisplay from "@/components/flow/nodes/BasicNode/BasicNodeDataDisplay";
import BasicNodeEditForm from "@/components/flow/nodes/BasicNode/BasicNodeEditForm";
import BlogNodeDataDisplay from "@/components/flow/nodes/BlogNode/BlogNodeDataDisplay";
import BlogNodeEditForm from "@/components/flow/nodes/BlogNode/BlogNodeEditForm";
import BookNodeDataDisplay from "@/components/flow/nodes/BookNode/BookNodeDataDisplay";
import BookNodeEditForm from "@/components/flow/nodes/BookNode/BookNodeEditForm";
import CategoryNodeDataDisplay from "@/components/flow/nodes/CategoryNode/CategoryNodeDataDisplay";
import CategoryNodeEditForm from "@/components/flow/nodes/CategoryNode/CategoryNodeEditForm";
import PodcastNodeDataDisplay from "@/components/flow/nodes/PodcastNode/PodcastNodeDataDisplay";
import PodcastNodeEditForm from "@/components/flow/nodes/PodcastNode/PodcastNodeEditForm";
import YoutubeNodeDataDisplay from "@/components/flow/nodes/YoutubeNode/YoutubeNodeDataDisplay";
import YoutubeNodeEditForm from "@/components/flow/nodes/YoutubeNode/YoutubeNodeEditForm";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReactComponent = (props: any) => JSX.Element;

type CustomNodeType = {
    name: string;
    order: number;
    edit: ReactComponent;
    data: ReactComponent;
    icon: LucideIcon;
};

export const customNodes: Record<string, CustomNodeType> = {
    category: {
        name: "Category",
        order: 0,
        edit: CategoryNodeEditForm,
        data: CategoryNodeDataDisplay,
        icon: Network,
    },
    basic: {
        name: "Basic",
        order: 1,
        edit: BasicNodeEditForm,
        data: BasicNodeDataDisplay,
        icon: Link2,
    },
    youtube: {
        name: "YouTube",
        order: 2,
        edit: YoutubeNodeEditForm,
        data: YoutubeNodeDataDisplay,
        icon: Youtube,
    },
    blog: {
        name: "Blog",
        order: 3,
        edit: BlogNodeEditForm,
        data: BlogNodeDataDisplay,
        icon: Rss,
    },
    article: {
        name: "Article",
        order: 4,
        edit: ArticleNodeEditForm,
        data: ArticleNodeDataDisplay,
        icon: Newspaper,
    },
    podcast: {
        name: "Podcast",
        order: 5,
        edit: PodcastNodeEditForm,
        data: PodcastNodeDataDisplay,
        icon: Podcast,
    },
    book: {
        name: "Book",
        order: 6,
        edit: BookNodeEditForm,
        data: BookNodeDataDisplay,
        icon: BookOpenText,
    },
};
