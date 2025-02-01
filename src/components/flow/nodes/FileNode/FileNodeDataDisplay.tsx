import { FileNodeData } from "@/store/types";
import { Badge } from "@/components/ui/badge";

export default function FileNodeDataDisplay({ data }: { data: FileNodeData }) {
  const handleDownload = () => {
    // Implement the logic to fetch and download the file using data.fileID
    fetch(`https://api.example.com/files/${data.fileId}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.title || "downloaded-file";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  return (
    <div className="p-4 bg-white max-w-md mx-auto flex flex-col justify-between h-full">
      <div className="text-center">
        <h2 className="text-lg font-bold">{data.title}</h2>
        <button onClick={handleDownload} className="text-blue-500 text-sm">
          Download File
        </button>
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
