"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup({
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

  const { data: authData, error: authError } = await supabase.auth.signUp(data);
  
  if (authError) {
    console.error(authError);
    redirect("/error");
  }

  if (authData.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({ id: authData.user.id });

    if (insertError) {
      console.error(insertError);
      redirect("/error");
    }
  }

  revalidatePath("/", "layout");
  redirect("/confirm");
}
