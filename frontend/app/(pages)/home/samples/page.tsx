import { getSamples } from "@/actions/me/samples";
import { Plus as PlusIcon } from "iconoir-react/regular";
import { Button } from "@/components/ui/button";
import SampleCard from "./parts/sample-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewSampleForm from "./parts/new-form";

export default async function SamplesPage() {
  const samples = await getSamples();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#fbfbfb] to-[#f7f7f7]">
      <header className="flex h-[60px] py-5 px-8 items-center border-b justify-between">
        <h1 className="text-2xl font-bold">Samples</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon />
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="font-sans">
            <DialogHeader>
              <DialogTitle>Create New Sample</DialogTitle>
              <DialogDescription>
                Create a new writing sample here.
              </DialogDescription>
            </DialogHeader>
            <NewSampleForm />
          </DialogContent>
        </Dialog>
      </header>
      <main className="flex-1 p-8">
        {samples && samples.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {samples.map((sample) => (
              <SampleCard
                key={sample.id}
                sample={sample}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No samples found</p>
        )}
      </main>
    </div>
  );
}
