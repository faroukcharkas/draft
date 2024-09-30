import { getUserDocuments } from "@/actions/me/documents";
import DocumentCard from "./parts/document";
import HomePageBlueprint from "../blueprint";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import StartDialog from "./parts/start";
import Head from "next/head";

export default async function DocumentsPage() {
  const documents = await getUserDocuments();
  return (
    <>
    <Head>
      <title>Documents - Pentip</title>
    </Head>
    <HomePageBlueprint 
      title="Documents" 
      iconName="description" 
      headerComponents={
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <span className="material-symbols-rounded mr-2">edit_square</span>
              Start New
            </Button>
          </DialogTrigger>
          <StartDialog />
        </Dialog>
      }
    >
      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No documents found</p>
      )}
      </HomePageBlueprint>
    </>
  );
}
