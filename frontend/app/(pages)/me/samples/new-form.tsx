"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSample } from "@/actions/sample/create";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => <Input {...field} />}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FORMAL">Formal</SelectItem>
                <SelectItem value="CASUAL">Casual</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <button type="submit">Create</button>
      </form>
    </Form>
  );
}
