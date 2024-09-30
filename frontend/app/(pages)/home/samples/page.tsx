import { getSamples } from "@/actions/me/samples";
import SampleCard from "./parts/sample-card";
import HomePageBlueprint from "../blueprint";
import Head from "next/head";
import AddSampleButton from "./parts/add-sample";

export default async function SamplesPage() {
  const samples = await getSamples();

  return (
    <>
    <Head>
      <title>Samples - Pentip</title>
    </Head>
    <HomePageBlueprint title="Samples" iconName="folder_open" headerComponents={<AddSampleButton />}>
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
    </HomePageBlueprint>
    </>
  );
}
