import SidebarItem from "./parts/item";

export default function Sidebar() {
  return (
    <div className="flex-0 min-w-[300px] bg-popover border-r pr-1">
      <div className="h-[60px] flex items-center justify-center">
        <h1 className="text-2xl font-bold">pentip</h1>
      </div>
      <div className="flex-1 flex flex-col">
        <SidebarItem href="/home/documents">Documents</SidebarItem>
        <SidebarItem href="/home/samples">Samples</SidebarItem>
      </div>
    </div>
  );
}
