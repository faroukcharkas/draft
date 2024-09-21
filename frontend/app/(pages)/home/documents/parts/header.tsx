"use client";

import { Button } from "@/components/ui/button";
import { Plus as PlusIcon } from "iconoir-react/regular";
import { createDocumentThenRedirect } from "@/actions/documents/create";

export default function Header() {
  return (
    <header className="flex h-[60px] py-5 px-8 items-center border-b justify-between">
      <h1 className="text-2xl font-bold">Documents</h1>
      <Button onClick={() => createDocumentThenRedirect()}>
        <PlusIcon />
        New
      </Button>
    </header>
  );
}
