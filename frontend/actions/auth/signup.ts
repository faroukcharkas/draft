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
    throw new Error(authError.message);
  }

  if (authData.user) {
    console.log(authData.user.id);
    const { error: insertError } = await supabase
      .from('user')
      .insert({ id: authData.user.id });

    if (insertError) {
      throw new Error("Couldn't create user, text 785-317-7277.");
    }
  }

  revalidatePath("/", "layout");
  redirect("/signup/confirm");
}
