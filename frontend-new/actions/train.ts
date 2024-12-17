"use server";

export async function trainOnWritingSample({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: string;
}) {
  const response = await fetch("/api/train", {
    method: "POST",
    body: JSON.stringify({ title, description, content }),
  });
  return response.json();
}
