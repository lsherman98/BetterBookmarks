import { useDnD } from "@/hooks/useDnD";
import { CrosshairIcon, Filter, GitFork, Plus, Share2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useReactFlow } from "@xyflow/react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { customNodes } from "@/lib/data";
import { TooltipIcon } from "./TooltipIcon";
import { useLayoutedElements } from "@/hooks/useLayoutedElements";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/extension/multi-select";
import { Button } from "../ui/button";
import { AppState } from "@/store/types";
import { useShallow } from "zustand/react/shallow";
import useStore from "@/store/store";

export function FlowToolbar() {
  return (
    <div className="mt-2 flex gap-2 bg-white h-[48px] px-4 py-2 shadow-lg rounded-xl border border-grey-400 items-center">
      <AddNodePopOver />
      <Filters />
      <FitViewTrigger />
      <Separator orientation="vertical" className="h-6" />
      <ShareButton />
      <ForkButton />
    </div>
  );
}

const AddNodePopOver = () => {
  const [, setType] = useDnD();
  const [isOpen, setIsOpen] = useState(false);

  const onDragStart = (event, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform`}
        >
          {isOpen ? <X size={28} /> : <TooltipIcon icon={<Plus size={28} />} tooltip="Add Node" />}
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
  const [, { toggle }] = useLayoutedElements();
  return (
    <TooltipIcon
      icon={<CrosshairIcon size={24} />}
      tooltip="Fit View"
      onClick={() => {
        toggle("on");
        setTimeout(() => {
          toggle("off");
          fitView({
            padding: 0.2,
            duration: 500,
          });
        }, 500);
      }}
    />
  );
};

const ShareButton = () => {
  return <TooltipIcon icon={<Share2 size={24} />} tooltip="Share" sideOffset={14} />;
};

const ForkButton = () => {
  return <TooltipIcon icon={<GitFork size={24} />} tooltip="Fork" sideOffset={14} />;
};

const filtersFormSchema = z.object({
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const selector = (state: AppState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
});

const Filters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState<{ label: string; value: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { nodes, setNodes } = useStore(useShallow(selector));

  const form = useForm<z.infer<typeof filtersFormSchema>>({
    resolver: zodResolver(filtersFormSchema),
    defaultValues: {
      tags: [],
      type: "",
    },
  });

  function onSubmit(values: z.infer<typeof filtersFormSchema>) {
    // Filter nodes with updated criteria:
    const filteredNodes = nodes.filter((node) => {
      // Always show category nodes.
      if (node.type === "category" || node.type === "root") return true;
      // Apply type filter.
      if (values.type && node.type !== values.type) return false;
      // Apply tags filter.
      if (values.tags && values.tags.length > 0) {
        const nodeTags = (node.data.tags as string[]) ?? [];
        if (!values.tags.every((tag) => nodeTags.includes(tag))) return false;
      }
      return true;
    });

    // Ensure that any node with a parent shows its parent as well.
    filteredNodes.forEach((node) => {
      if (node.data.parent) {
        const parentNode = nodes.find((n) => n.id === node.data.parent);
        if (parentNode && !filteredNodes.includes(parentNode)) {
          filteredNodes.push(parentNode);
        }
      }
    });

    setNodes(nodes.map((node) => ({ ...node, hidden: !filteredNodes.includes(node) })));
  }

  function handleClearFilters() {
    setNodes(nodes.map((node) => ({ ...node, hidden: false })));
    form.reset({
      type: "", // updated: changed from undefined to ""
      tags: [],
    });
  }

  useEffect(() => {
    const nodeTypes = Object.keys(customNodes)
      .sort((a, b) => customNodes[a].order - customNodes[b].order)
      .map((key) => {
        return {
          value: key,
          label: customNodes[key].name,
        };
      });
    setTypes(nodeTypes);

    const tags = nodes.flatMap((node) => node.data.tags ?? []) as string[];
    setTags([...new Set(tags)]);
  }, []);

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`cursor-pointer flex items-center justify-center hover:scale-110 transition-transform transform`}
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <TooltipIcon icon={<Filter size={24} />} tooltip="Filter" sideOffset={14} />
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
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value ?? []}
                        onValuesChange={field.onChange}
                        loop
                        className=""
                      >
                        <MultiSelectorTrigger>
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
