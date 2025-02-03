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
import { ArticleNodeEditFormProps } from "@/store/types";

const formSchema = z.object({
  title: z.string().max(48),
  url: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional().default([""]),
});

export default function ArticleNodeEditForm({ handleUpdateNode, data }: ArticleNodeEditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title || "",
      url: data.url || "",
      description: data.description || "",
      tags: data.tags || [],
    },
    mode: "onBlur",
    shouldFocusError: false,
  });

  const onChange = (values: z.infer<typeof formSchema>) => handleUpdateNode(values);

  const urlValue = form.watch("url");
  const isUrlEmpty = !urlValue;

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChange)} className="space-y-4 max-w-3xl mx-auto py-2">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left nodrag">
              <FormLabel className="text-xs">URL</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    className="h-6 text-xs"
                    placeholder="www.google.com"
                    type="text"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-right" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left nodrag">
              <FormLabel className="text-xs">Title</FormLabel>
              <FormControl>
                <Input
                  className="h-6 text-xs"
                  placeholder="<Placeholder>"
                  type="text"
                  disabled={isUrlEmpty}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-right" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left nodrag">
              <FormLabel className="text-xs">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description"
                  className="text-xs min-h-[60px] resize-none"
                  disabled={isUrlEmpty}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-right" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left nodrag">
              <FormLabel className="text-xs">Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Enter your tags"
                  className="text-xs disabled"
                  disabled={isUrlEmpty}
                />
              </FormControl>
              <FormMessage className="text-xs text-right" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
