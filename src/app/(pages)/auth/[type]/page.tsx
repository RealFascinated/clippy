import AccountForm from "@/components/auth/account-form";
import { AuthType } from "@/type/auth-type";

type AuthPageProps = {
  params: Promise<{
    type: AuthType;
  }>;
};

export default async function AuthPage({ params }: AuthPageProps) {
  const { type } = await params;

  return (
    <main className="w-full flex justify-center items-center h-full">
      <div>
        <AccountForm type={type} />
      </div>
    </main>
  );
}
