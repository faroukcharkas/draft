import Sidebar from "@/components/sidebar/sidebar";
import NoiseOverlay from "@/components/noise-overlay";
import Head from "next/head";
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Head>
      <title>Home - Pentip</title>
    </Head>
    <div className="flex flex-row h-screen w-screen p-3">
      <NoiseOverlay />
      <Sidebar />
        <div className="flex flex-1 z-10 shadow-xl rounded-xl">{children}</div>
      </div>
    </>
  );
}
