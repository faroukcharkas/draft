import Document from "./components/document/document";

export default function Home() {
  return (
    <div className="flex h-screen w-screen">
      <main className="flex flex-1 justify-center">
        <Document />
      </main>
    </div>
  );
}
