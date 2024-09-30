import NoiseOverlay from "@/components/noise-overlay";
import "material-symbols/rounded.css";
import Link from "next/link";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
      <>
        <div className="absolute top-5 left-5 z-20">
          <Link href="/home/documents" className="hover:cursor-pointer">
            <span className="material-symbols-rounded text-[50px]">arrow_back</span>
          </Link>
        </div>
        <div className="flex flex-col h-screen w-screen bg-background p-3 gap-2">
            <NoiseOverlay />
            <div className="flex h-screen justify-center w-full z-10">
                {children}
            </div>
        </div>
      </>
    );
}