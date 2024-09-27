import SidebarItem from "./parts/item";
import Logo from "../brand/logo";
import { Archive } from "iconoir-react/regular";
import { PageEdit } from "iconoir-react/regular";

export default function Sidebar() {
  return (
    <div className="flex-0 min-w-[300px] bg-white border-r pr-1 relative">
      <div className="absolute inset-0 noise pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-start px-6 py-6">
          <Logo size={36} />
        </div>
        <div className="flex-1 flex flex-col px-6 gap-2">
          <SidebarItem href="/home/documents" icon={<Archive className="w-4 h-4" />}>Documents</SidebarItem>
          <SidebarItem href="/home/samples" icon={<PageEdit className="w-4 h-4" />}>Samples</SidebarItem>
        </div>
      </div>
    </div>
  );
}
