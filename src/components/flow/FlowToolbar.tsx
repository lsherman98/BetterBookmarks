import { useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CrosshairIcon, Filter, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/extension/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TooltipIcon } from "@/components/flow/TooltipIcon";
import { customNodes } from "@/lib/data";
import { useDnD } from "@/hooks/useDnD";
import useStore from "@/store/store";
import { AppState } from "@/store/types";

const FIT_VIEW_DELAY = 500;
const FIT_VIEW_CONFIG = {
  padding: 0.2,
  duration: 500,
  maxZoom: 1,
};

const storeSelector = (state: AppState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  layoutNodes: state.layoutNodes,
});

const filtersFormSchema = z.object({
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type FiltersFormValues = z.infer<typeof filtersFormSchema>;

export function FlowToolbar() {
  return (
    <div className="mt-2 flex gap-2 bg-white px-4 py-2 shadow-lg rounded-xl border border-grey-400 items-center">
      <AddNodePopOver />
      <Filters />
      <FitViewTrigger />
    </div>
  );
}

const AddNodePopOver = () => {
  const [, setType] = useDnD();
  const [isOpen, setIsOpen] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform`}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <TooltipIcon icon={<Plus size={24} />} tooltip="Bookmarks" sideOffset={12} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white shadow-lg rounded-lg"
        side="bottom"
        align="center"
        sideOffset={20}
      >
        <div className="grid grid-cols-4 gap-4 p-4">
          {Object.keys(customNodes)
            .sort((a, b) => customNodes[a].order - customNodes[b].order)
            .map((key, index) => {
              const node = customNodes[key];
              return (
                <div
                  key={index}
                  onDragStart={(event) => onDragStart(event, key)}
                  className="w-12 h-12 flex justify-center items-center cursor-grab transition-transform transform hover:scale-105"
                  draggable
                >
                  <TooltipIcon icon={<node.icon size={36} />} tooltip={node.name} sideOffset={2} />
                </div>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FitViewTrigger = () => {
  const { fitView } = useReactFlow();
  const { layoutNodes } = useStore(useShallow(storeSelector));

  const handleFitView = () => {
    layoutNodes();
    setTimeout(() => {
      fitView(FIT_VIEW_CONFIG);
    }, FIT_VIEW_DELAY);
  };

  return (
    <TooltipIcon
      icon={<CrosshairIcon size={24} />}
      tooltip="Fit Content"
      sideOffset={14}
      onClick={handleFitView}
    />
  );
};

const Filters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState<{ label: string; value: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { nodes, setNodes } = useStore(useShallow(storeSelector));

  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersFormSchema),
    defaultValues: {
      tags: [],
      type: "",
    },
  });

  useEffect(() => {
    const nodeTypes = Object.keys(customNodes)
      .sort((a, b) => customNodes[a].order - customNodes[b].order)
      .map((key) => ({
        value: key,
        label: customNodes[key].name,
      }));
    setTypes(nodeTypes);

    const allTags = nodes.flatMap((node) => node.data.tags ?? []) as string[];
    setTags([...new Set(allTags)]);
  }, [nodes]);

  function onSubmit(values: FiltersFormValues) {
    const filteredNodes = nodes.filter((node) => {
      if (node.type === "category" || node.type === "root") return true;

      if (values.type && node.type !== values.type) return false;

      if (values.tags && values.tags.length > 0) {
        const nodeTags = (node.data.tags as string[]) ?? [];
        if (!values.tags.every((tag) => nodeTags.includes(tag))) return false;
      }

      return true;
    });

    filteredNodes.forEach((node) => {
      if (node.data.parent) {
        const parentNode = nodes.find((n) => n.id === node.data.parent);
        if (parentNode && !filteredNodes.includes(parentNode)) {
          filteredNodes.push(parentNode);
        }
      }
    });

    setNodes(
      nodes.map((node) => ({
        ...node,
        hidden: !filteredNodes.includes(node),
      }))
    );
  }

  function handleClearFilters() {
    setNodes(nodes.map((node) => ({ ...node, hidden: false })));
    form.reset({
      type: "",
      tags: [],
    });
  }

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform`}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <TooltipIcon icon={<Filter size={24} />} tooltip="Filters" sideOffset={14} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white shadow-lg rounded-lg p-4 w-72"
        side="bottom"
        align="center"
        sideOffset={20}
      >
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bookmark Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by Bookmark Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-4">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value ?? []}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger className="border border-gray-200 rounded-md">
                          <MultiSelectorInput />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {tags.map((tag) => (
                              <MultiSelectorItem key={tag} value={tag}>
                                {tag}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <div className="flex justify-end space-x-2">
                <Button onClick={handleClearFilters} variant={"ghost"}>
                  Clear
                </Button>
                <Button type="submit">Search</Button>
              </div>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
