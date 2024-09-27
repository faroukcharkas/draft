"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createSample } from "@/actions/samples/create";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const newSampleSchema = z.object({
  text: z.string().min(1, "Text is required"),
  style: z.enum(["FORMAL", "CASUAL"]),
});

export default function NewSampleForm() {
  const form = useForm<z.infer<typeof newSampleSchema>>({
    resolver: zodResolver(newSampleSchema),
    defaultValues: {
      text: "",
      style: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof newSampleSchema>) {
    console.log("clicked");
    createSample(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sample Text</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter your sample text here" 
                  className="min-h-[100px]" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Writing Style</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FORMAL">Formal</SelectItem>
                  <SelectItem value="CASUAL">Casual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Create Sample</Button>
      </form>
    </Form>
  );
}
