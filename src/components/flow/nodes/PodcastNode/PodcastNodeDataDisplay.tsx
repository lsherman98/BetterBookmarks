import { PodcastNodeData } from "@/store/types";
import { Badge } from "@/components/ui/badge";

export default function PodcastNodeDataDisplay({ data }: { data: PodcastNodeData }) {
  return (
    <div className="p-4 bg-white max-w-md mx-auto flex flex-col justify-between h-full">
      <div className="text-center">
        <h2 className="text-lg font-bold">{data.title}</h2>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm"
        >
          {data.url}
        </a>
        <p className="text-sm mt-2">{data.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {data.tags?.map((tag, index) => (
          <Badge key={index} className="text-xs" variant={"outline"}>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
