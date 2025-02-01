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
import { FileNodeEditFormProps } from "@/store/types";
import { useDropzone } from "react-dropzone";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().max(48),
  file: z.instanceof(File, { message: "Please upload a valid file" }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional().default([""]),
});

export default function FileNodeEditForm({ handleUpdateNode, data }: FileNodeEditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title || "",
      file: undefined,
      description: data.description || "",
      tags: data.tags || [],
    },
    mode: "onBlur",
    shouldFocusError: false,
  });

  const onChange = (values: z.infer<typeof formSchema>) => handleUpdateNode(values);

  const [isDragActive, setIsDragActive] = useState(false);

  const onFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      form.setValue("file", acceptedFiles[0]);
    }
    setIsDragActive(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileDrop,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const fileValue = form.watch("file");
  const isFileEmpty = !fileValue;

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChange)} className="space-y-4 max-w-3xl mx-auto py-2">
        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem className="space-y-1 text-left nodrag">
              <FormLabel className="text-xs">File</FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`border-dashed border-2 p-4 text-center cursor-pointer ${
                    isDragActive ? "border-blue-500 bg-blue-100" : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  {isFileEmpty ? (
                    <p className="text-xs">Drag 'n' drop a file here, or click to select one</p>
                  ) : (
                    <p className="text-xs">{fileValue.name}</p>
                  )}
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
                  disabled={isFileEmpty}
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
                  disabled={isFileEmpty}
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
                  disabled={isFileEmpty}
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
