"use client";

import { Form, FormField, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  function onSubmit(data: z.infer<typeof loginSchema>) {
    login(data);
  }

  return (
    <div className="max-w-[450px] w-full bg-white border p-4 rounded-2xl">
      <h1 className="text-2xl font-bold">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button type="submit">Log In</Button>
          <a href="/signup">Don&apos;t have an account? Sign up</a>
        </form>
      </Form>
    </div>
  );
}
