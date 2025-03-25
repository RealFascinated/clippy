export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center w-full justify-center">
      <div className="flex flex-1 flex-col gap-4 p-4 items-center w-full max-w-[1600px]">
        {children}
      </div>
    </div>
  );
}
