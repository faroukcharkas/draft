import NoiseOverlay from "@/components/noise-overlay";
import Logo from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-screen">
      <NoiseOverlay />
      <div className="relative z-10 max-w-[350px] w-full rounded-2xl shadow-md">
        <div className="relative z-10 bg-white p-10 rounded-2xl border flex flex-col items-center gap-5">
          <Logo size={40} color="primary" />
          {children}
        </div>
      </div>
    </div>
  );
}
