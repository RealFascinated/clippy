export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>;
}
