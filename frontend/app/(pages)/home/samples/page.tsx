import { getSamples } from "@/actions/me/samples";
import Link from "next/link";
import { Tables } from "@/packages/schema";
import { Plus as PlusIcon } from "iconoir-react/regular";
import { Button } from "@/components/ui/button";
import NewSampleForm from "./new-form";

function Sample({ sample }: { sample: Tables<"writing_sample"> }) {
  return (
    <Link
      href={`/sample/${sample.id}`}
      className="p-4 border gap-2 flex flex-col rounded-lg hover:bg-gray-100"
    >
      <h2 className="text-md font-semibold">{sample.text}</h2>
    </Link>
  );
}

export default async function SamplesPage() {
  const samples = await getSamples();

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-[#fbfbfb] to-[#f7f7f7]">
      <header className="flex h-[60px] p-5 items-center border-b">
        <h1 className="text-2xl font-bold">Pentip</h1>
      </header>
      <main className="flex-1 p-8">
        <div className="flex flex-row justify-between mb-4">
          <h1 className="text-2xl font-bold">Samples</h1>
          <Button>
            <PlusIcon />
            New
          </Button>
        </div>
        {samples && samples.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {samples.map((sample) => (
              <Sample
                key={sample.id}
                sample={sample}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No samples found</p>
        )}
      </main>
      <div className="p-8 border-t">
        <h2 className="text-xl font-bold mb-4">New Sample</h2>
        <NewSampleForm />
      </div>
    </div>
  );
}
