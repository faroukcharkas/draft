import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-b from-[#fbfbfb] to-[#f7f7f7]">
      <h1 className="text-6xl font-bold mb-4">Pentip</h1>
      <p className="text-4xl text-center mb-8">Express yourself effortlessly</p>
      <div className="flex space-x-4">
        <Link href="/home/documents">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go Home
          </button>
        </Link>
        <Link href="/signup">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
