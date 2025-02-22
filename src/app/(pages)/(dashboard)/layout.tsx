import AppSidebar from "@/components/dashboard/sidebar/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <AppSidebar />
      <SidebarInset className="bg-none flex items-center w-full flex-col">
        <div className="flex items-center w-full max-w-7xl">
          <div className="flex flex-1 flex-col gap-4 p-4 items-center w-full">
            {children}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
