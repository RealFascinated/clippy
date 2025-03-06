import AppSidebar from "@/components/dashboard/sidebar/sidebar";
import OnekoKitty from "@/components/oneko-kitty";
import { SidebarInset } from "@/components/ui/sidebar";
import { getUser } from "@/lib/helpers/user";
import PreferencesProvider from "@/providers/preferences-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  const user = await getUser();
  return (
    <div className="flex flex-1">
      <AppSidebar />
      <SidebarInset className="min-h-full flex items-center w-full flex-col">
        <div className="flex items-center w-full max-w-[1600px]">
          <div className="flex flex-1 flex-col gap-4 p-4 items-center w-full">
            {children}
          </div>
        </div>
        {user.preferences?.showKitty && <OnekoKitty />}
      </SidebarInset>
    </div>
  );
=======
	const user = await getUser();
	return (
		<div className="flex flex-1">
			<PreferencesProvider user={user}>
				<AppSidebar />
				<SidebarInset className="min-h-full flex items-center w-full flex-col">
					<div className="flex items-center w-full max-w-[1600px]">
						<div className="flex flex-1 flex-col gap-4 p-4 items-center w-full">
							{children}
						</div>
					</div>
					<OnekoKitty />
				</SidebarInset>
			</PreferencesProvider>
		</div>
	);
>>>>>>> 5d1d58aafb8d63a57b4f5227a40d180a0aa17033
}
