import Sidebar from "@/components/sidebar/sidebar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row h-screen w-screen">
      <Sidebar />
      <div className="flex-1 bg-background">{children}</div>
    </div>
  );
}
