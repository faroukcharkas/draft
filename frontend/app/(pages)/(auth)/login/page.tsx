"use client";

import { Form, FormField, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

import { login } from "../../../../actions/auth/login";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const { toast } = useToast();

  function onSubmit(data: z.infer<typeof loginSchema>) {
    login(data)
      .then(() => {
        toast({
          title: "Success",
          description: "You have been logged in successfully!",
          variant: "default",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      });
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="Email"
                    />
                  </FormControl>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      id="password"
                      placeholder="Password"
                    />
                  </FormControl>
                </>
              )}
            />
          </div>
          <Button type="submit" className="mt-2">Log In</Button>
          <a href="/signup" className="text-sm text-gray-500 mt-2 underline">Don&apos;t have an account? Sign up</a>
        </form>
      </Form>
    </>
  );
}
