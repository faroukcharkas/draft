import "material-symbols/rounded.css";
import { readDocument } from "@/actions/documents/read";
import Editor from "./parts/editor";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
} from "@/components/ui/drawer";
import EditDescription from "./parts/edit-description";

export default async function DocumentPage({
  params,
}: {
  params: { documentId: string };
}) {
  const document = await readDocument(params.documentId);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1"></div>
      <Editor initialDocument={document} />
      <div className="flex flex-1 flex-col px-2 justify-end items-start">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" className="gap-2 font-semibold text-muted-foreground">
              <span className="material-symbols-rounded">edit_note</span>
              Edit Description
            </Button>
          </DrawerTrigger>
          <EditDescription documentId={document.id} initialDescription={document.description} />
        </Drawer>
      </div>
    </div>
  );
}
