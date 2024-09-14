"use client";

import { Form, FormField, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import { signup } from "../../../../actions/auth/signup";

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: z.infer<typeof signupSchema>) {
    signup(data);
  }

  return (
    <div className="max-w-[450px] w-full bg-white border p-4 rounded-2xl">
      <h1 className="text-2xl font-bold">Sign Up</h1>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                  />
                </FormControl>
              </>
            )}
          />
          <Button type="submit">Sign Up</Button>
          <a href="/login">Already have an account? Log in</a>
        </form>
      </Form>
    </div>
  );
}
