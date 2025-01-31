import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "@/components/ui/extension/tags-input";
import { NodeData } from "@/store/types";

type DefaultNodeEditFormProps = {
  handleUpdateNode: (data: NodeData) => void;
  data: NodeData;
};

const formSchema = z.object({
  title: z.string().max(48),
  url: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).nonempty("Please at least one item").optional().default([""]),
});

export default function DefaultNodeEditForm({ handleUpdateNode, data }: DefaultNodeEditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      url: data.url,
      description: data.description,
      tags: data.tags || [],
    },
  });

  function onChange(values: z.infer<typeof formSchema>) {
    const data: NodeData = {
      title: values.title,
      url: values.url,
      description: values.description,
      tags: values.tags,
    };
    handleUpdateNode(data);
  }

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChange)} className="space-y-4 max-w-3xl mx-auto py-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-xs">Title</FormLabel>
              <FormControl>
                <Input className="h-6 text-xs" placeholder="<Placeholder>" type="text" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-xs">URL</FormLabel>
              <FormControl>
                <Input
                  className="h-6 text-xs"
                  placeholder="www.google.com"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-xs">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description"
                  className="text-xs min-h-[60px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-xs">Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Enter your tags"
                  className="text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
