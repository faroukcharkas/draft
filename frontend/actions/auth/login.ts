"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = createClient();

  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);
  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/me");
}
