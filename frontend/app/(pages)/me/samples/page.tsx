import { getSamples } from "@/actions/me/samples";
import NewSampleForm from "./new-form";

export default async function SamplesPage() {
  const samples = await getSamples();

  return (
    <>
      <div>
        <h1>Samples</h1>
        {samples ? (
          samples.map((sample) => <div key={sample.id}>{sample.text}</div>)
        ) : (
          <p>No samples available.</p>
        )}
      </div>
      <div>
        <h1>New sample</h1>
        <NewSampleForm />
      </div>
    </>
  );
}
