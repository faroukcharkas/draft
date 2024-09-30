"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/packages/schema";


export async function getUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data;
}

export async function getUserDocuments() {
  console.log("getUserDocuments");
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return null;
  }

  const { data: documents, error } = await supabase
    .from("document")
    .select("*")
    .eq("user_id", user.user.id);

  console.log("documents", documents);
  console.log("user", user.user.id);

  if (error) {
    console.error("Error fetching documents:", error);
    return null;
  }

  return documents as Tables<"document">[];
}
